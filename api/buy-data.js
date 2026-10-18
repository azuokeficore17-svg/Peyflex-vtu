export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { network, mobile_number, plan_code } = req.body;

  if (!network || !mobile_number || !plan_code) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    // Peyflex Data Top-Up Endpoint
    const pexResponse = await fetch('https://client.peyflex.com.ng/api/data/topup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.PEYFLEX_API_KEY}`
      },
      body: JSON.stringify({
        network: network.toLowerCase(),
        mobile_number: mobile_number,
        plan_code: plan_code
      })
    });

    const data = await pexResponse.json();

    if (pexResponse.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(400).json({ success: false, message: data.message || 'Transaction failed', data });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server connection error to Peyflex',
      error: error.message
    });
  }
}
