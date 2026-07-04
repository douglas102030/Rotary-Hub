import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

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
    await page.waitForSelector('h1, [data-qa="campaign-title"], .campaign-title, img', { 
      timeout: 10000 
    }).catch(() => null);

    // Esperar mais um pouco para lazy-loading
    await page.waitForTimeout(2000);

    // Executar JavaScript para extrair dados mais confiáveis
    const extractedData = await page.evaluate(() => {
      // Extrair título
      let title = '';
      const titleEl = 
        document.querySelector('h1') ||
        document.querySelector('[data-qa="campaign-title"]') ||
        document.querySelector('.campaign-title') ||
        document.querySelector('meta[property="og:title"]');
      
      if (titleEl) {
        title = titleEl.textContent || titleEl.getAttribute('content') || '';
      }

      // Extrair descrição
      let description = '';
      const descriptionEl = 
        document.querySelector('[data-qa="campaign-description"]') ||
        document.querySelector('.campaign-description') ||
        document.querySelector('[class*="story"]') ||
        document.querySelector('meta[property="og:description"]');
      
      if (descriptionEl) {
        description = descriptionEl.textContent || descriptionEl.getAttribute('content') || '';
      }

      // Se não encontrou, procura em paragrafos grandes
      if (!description) {
        const paragraphs = Array.from(document.querySelectorAll('p'));
        const largePara = paragraphs.find(p => (p.textContent || '').length > 100);
        if (largePara) {
          description = largePara.textContent || '';
        }
      }

      // Extrair imagens - procura em TODOS os lugares possíveis
      const imageSet = new Set<string>();

      // 1. Em tags img
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (src && src.startsWith('http')) {
          imageSet.add(src);
        }
      });

      // 2. Em tags picture
      document.querySelectorAll('picture source').forEach(source => {
        const srcset = source.getAttribute('srcset');
        if (srcset) {
          const urls = srcset.split(',').map(item => item.trim().split(' ')[0]);
          urls.forEach(url => {
            if (url && url.startsWith('http')) {
              imageSet.add(url);
            }
          });
        }
      });

      // 3. Em background-image CSS
      document.querySelectorAll('[style*="background-image"]').forEach(el => {
        const style = window.getComputedStyle(el);
        const backgroundImage = style.backgroundImage;
        if (backgroundImage) {
          const urlMatch = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
          if (urlMatch && urlMatch[1] && urlMatch[1].startsWith('http')) {
            imageSet.add(urlMatch[1]);
          }
        }
      });

      // 4. Em Open Graph meta tags
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
      if (ogImage && ogImage.startsWith('http')) {
        imageSet.add(ogImage);
      }

      // 5. Em data attributes (comum em React)
      document.querySelectorAll('[data-image], [data-src], [data-background]').forEach(el => {
        const image = el.getAttribute('data-image') || 
                     el.getAttribute('data-src') || 
                     el.getAttribute('data-background');
        if (image && image.startsWith('http')) {
          imageSet.add(image);
        }
      });

      // Filtrar imagens de navegação/ícones
      const images = Array.from(imageSet).filter(url => {
        const lower = url.toLowerCase();
        return !lower.includes('logo') && 
               !lower.includes('icon') && 
               !lower.includes('gstatic') &&
               !lower.includes('avatar') &&
               !lower.includes('spinner');
      }).slice(0, 10);

      return { title, description, images };
    });

    let title = extractedData.title.trim();
    let description = extractedData.description.trim();
    let images = extractedData.images;

    // Remover "GoFundMe" do título se estiver lá
    title = title.replace(/\s*-\s*GoFundMe\s*$/i, '').trim();

    // Limitar descrição
    description = description.substring(0, 500).trim();

    // Validar dados extraídos
    if (!title || title.length < 3) {
      console.log('No title found. Extracted data:', { title, description: description.substring(0, 100), imagesCount: images.length });
      return res.status(400).json({
        success: false,
        title: '',
        description: '',
        images: [],
        message: 'Could not extract campaign title. Make sure the URL is correct and the campaign is public.'
      });
    }

    console.log('✅ Successfully extracted GoFundMe data:', {
      title: title.substring(0, 50),
      descriptionLength: description.length,
      imagesCount: images.length,
      images: images.slice(0, 3)
    });

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
