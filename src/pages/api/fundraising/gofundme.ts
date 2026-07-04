import type { NextApiRequest, NextApiResponse } from 'next';

interface FundraisingData {
  title: string;
  goal: number;
  raised: number;
  donors: number;
  percent: number;
  url: string;
  daysLeft?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FundraisingData | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Extrair ID da campanha da URL
    // Formato: https://www.gofundme.com/f/campaign-name ou apenas o ID
    let campaignId = url;
    
    if (url.includes('gofundme.com')) {
      const match = url.match(/\/f\/([a-zA-Z0-9-]+)/);
      if (match) {
        campaignId = match[1];
      } else {
        return res.status(400).json({ error: 'Invalid GoFundMe URL format' });
      }
    }

    // NOTA: Para implementação real, você precisaria:
    // 1. Usar a API oficial do GoFundMe (requer autenticação)
    // 2. Fazer scraping do site (não recomendado)
    // 3. Usar um serviço terceirizado

    // Por enquanto, retornar dados simulados baseados no URL
    // Em produção, fazer requisição real à API
    const simulatedData: FundraisingData = {
      title: `Campaign: ${campaignId}`,
      goal: 50000,
      raised: Math.floor(Math.random() * 50000),
      donors: Math.floor(Math.random() * 500) + 50,
      percent: Math.floor(Math.random() * 100),
      url: url,
      daysLeft: Math.floor(Math.random() * 60) + 1,
    };

    // Chamar API real do GoFundMe se implementado
    // const campaign = await fetchGoFundMeData(campaignId);

    return res.status(200).json(simulatedData);
  } catch (error) {
    console.error('Error fetching GoFundMe data:', error);
    return res.status(500).json({ error: 'Failed to fetch fundraising data' });
  }
}
