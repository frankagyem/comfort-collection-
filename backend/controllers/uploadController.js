import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const PLACEHOLDERS = ['REPLACE_WITH', 'your_supabase', 'example.supabase.co'];

const isConfigured = (value) =>
  Boolean(value) && !PLACEHOLDERS.some((placeholder) => value.includes(placeholder));

let client;

const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (!isConfigured(url) || !isConfigured(key)) {
    const error = new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_KEY in backend/.env to enable image uploads.'
    );
    error.status = 503;
    throw error;
  }

  if (!client) {
    client = createClient(url, key);
  }

  return client;
};

// @desc    Upload image to Supabase Storage
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

    const supabase = getSupabase();

    // Upload to Supabase 'products' bucket
    const { error } = await supabase.storage
      .from('products') // Make sure this bucket is created in Supabase!
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new Error(error.message);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl: publicUrlData.publicUrl,
    });
  } catch (error) {
    next(error);
  }
};

export { uploadImage };
