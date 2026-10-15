export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { network, phone, plan_id, request_id } = req.body;

  if (!network || !phone || !plan_id) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    const pexResponse = await fetch('https://peyflex.com.ng/api/v1/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PEYFLEX_API_KEY}`
      },
      body: JSON.stringify({
        network,
        phone,
        plan_id,
        request_id: request_id || Date.now().toString()
      })
    });

    const data = await pexResponse.json();

    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error connection to Peyflex',
      error: error.message
    });
  }
}
