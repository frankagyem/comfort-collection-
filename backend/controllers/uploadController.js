import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    
    // Upload to Supabase 'products' bucket
    const { data, error } = await supabase.storage
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
