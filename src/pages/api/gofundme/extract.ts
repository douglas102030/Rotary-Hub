import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
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

  let browser;
  try {
    // Inicializar Puppeteer com modo sem cabeçalho
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 30000
    });

    const page = await browser.newPage();
    
    // Configurar timeout
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);

    // Navegar para a URL
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Esperar o conteúdo carregar
    await page.waitForSelector('h1, [data-qa="campaign-title"], .campaign-title', { 
      timeout: 10000 
    }).catch(() => null);

    // Pegar o HTML renderizado
    const html = await page.content();
    const $ = cheerio.load(html);

    // Extrair título - tenta vários seletores
    let title = '';
    title = $('h1').first().text().trim() ||
            $('[data-qa="campaign-title"]').first().text().trim() ||
            $('.campaign-title').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            '';

    // Remover "GoFundMe" do título se estiver lá
    title = title.replace(/\s*-\s*GoFundMe\s*$/i, '').trim();

    // Extrair descrição - procura pelo story/description
    let description = '';
    
    // Tentar vários seletores comuns no GoFundMe
    const descriptionText = 
      $('[data-qa="campaign-description"]').text() ||
      $('.campaign-description').text() ||
      $('[class*="story"]').first().text() ||
      $('meta[property="og:description"]').attr('content') ||
      $('p').filter((i, el) => $(el).text().length > 100).first().text() ||
      '';

    description = descriptionText.substring(0, 500).trim();

    // Extrair imagens
    const images: string[] = [];
    
    // Procura por images no atributo src e srcset
    $('img').each((_, elem) => {
      const src = $(elem).attr('src') || 
                 $(elem).attr('data-src') ||
                 $(elem).attr('data-lazy-src');
      
      if (src && src.startsWith('http') && images.length < 10) {
        // Filtrar imagens de navegação/ícones
        if (!src.includes('logo') && 
            !src.includes('icon') &&
            !src.includes('gstatic') &&
            !src.includes('avatar') &&
            !images.includes(src)) {
          images.push(src);
        }
      }
    });

    // Se não encontrou muitas imagens, procurar em Open Graph
    if (images.length < 3) {
      const ogImage = $('meta[property="og:image"]').attr('content');
      if (ogImage && ogImage.startsWith('http') && !images.includes(ogImage)) {
        images.push(ogImage);
      }
    }

    // Validar dados extraídos
    if (!title || title.length < 3) {
      return res.status(400).json({
        success: false,
        title: '',
        description: '',
        images: [],
        message: 'Could not extract campaign title. Make sure the URL is correct and the campaign is public.'
      });
    }

    await browser.close();

    return res.status(200).json({
      success: true,
      title: title.substring(0, 200),
      description: description || 'Campaign description not available',
      images: images.slice(0, 10),
      message: 'Data extracted successfully'
    });

  } catch (error) {
    console.error('Error extracting GoFundMe data:', error);
    
    if (browser) {
      await browser.close().catch(() => null);
    }
    
    return res.status(500).json({
      success: false,
      title: '',
      description: '',
      images: [],
      message: `Failed to extract data: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure the URL is correct and the campaign is public.`
    });
  }
}
