const CartItem = require('../models/CartItem');
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchMetadata(url) {
  try {
    const { data } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(data);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || null;
    const image = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src') || null;

    return { title, image };
  } catch (err) {
    console.log('Metadata fetch failed:', err.message);
    return null;
  }
}

exports.addItemToCart = async (req, res) => {
  try {
    const { url, name, image } = req.body;
    const userId = req.user.id;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    let finalName = name;
    let finalImage = image;

    if (!name || !image) {
      const metadata = await fetchMetadata(url);
      if (metadata) {
        finalName = metadata.title || name;
        finalImage = metadata.image || image;
      } else if (!name && !image) {
        return res.status(400).json({
          message:
            'Metadata fetch failed. Please provide name and image manually.',
        });
      }
    }

    const newItem = new CartItem({
      user: userId,
      url,
      name: finalName,
      image: finalImage,
    });

    await newItem.save();
    return res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// after addItemToCart …

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await CartItem.find({ user: userId });
    res.json(items);
  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;

    const item = await CartItem.findOne({ _id: itemId, user: userId });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.remove();
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
