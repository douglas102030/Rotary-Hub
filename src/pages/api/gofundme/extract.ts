import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface ExtractedData {
  title: string;
  description: string;
  images: string[];
  success: boolean;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExtractedData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      title: '',
      description: '',
      images: [],
      message: 'Method not allowed' 
    });
  }

  const { url } = req.body;

  if (!url || !url.includes('gofundme.com')) {
    return res.status(400).json({ 
      success: false,
      title: '',
      description: '',
      images: [],
      message: 'Invalid GoFundMe URL' 
    });
  }

  try {
    // Fazer requisição para obter o HTML da página
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extrair título - tenta vários seletores comuns
    let title = '';
    title = $('h1').first().text().trim() || 
            $('[data-reactroot] h1').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            $('title').text().split('-')[0].trim() ||
            '';

    // Extrair descrição - procura por story text ou paragraphs
    let description = '';
    const storyText = $('.story-text').text() || 
                      $('[class*="description"]').first().text() ||
                      $('meta[property="og:description"]').attr('content') ||
                      $('p').first().text() ||
                      '';
    description = storyText.substring(0, 500).trim(); // Limitar a 500 caracteres

    // Extrair imagens
    const images: string[] = [];
    
    // Procura por images nos atributos de dados (Next.js)
    $('img').each((_, elem) => {
      const src = $(elem).attr('src') || $(elem).attr('data-src');
      if (src && 
          src.startsWith('http') && 
          !src.includes('gstatic') && 
          !src.includes('logo') &&
          images.length < 10) {
        // Filtrar imagens de logo/ícones
        if (!images.includes(src)) {
          images.push(src);
        }
      }
    });

    // Se não encontrou muitas imagens, procura no Open Graph
    if (images.length < 3) {
      const ogImage = $('meta[property="og:image"]').attr('content');
      if (ogImage && ogImage.startsWith('http')) {
        images.push(ogImage);
      }
    }

    return res.status(200).json({
      success: true,
      title: title || 'Campaign Title',
      description: description || 'Campaign description not available',
      images: images.slice(0, 10), // Máximo 10 imagens
      message: 'Data extracted successfully'
    });

  } catch (error) {
    console.error('Error extracting GoFundMe data:', error);
    
    return res.status(500).json({
      success: false,
      title: '',
      description: '',
      images: [],
      message: 'Failed to extract data from GoFundMe URL. Make sure the URL is correct and the campaign is public.'
    });
  }
}
