import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 这里需要替换为实际的faucet API地址
    const FAUCET_API_URL = process.env.FAUCET_API_URL || 'https://mars.scan.movachain.com/faucetapi/faucet/v1/transfer';
    
    console.log('Proxying request to:', FAUCET_API_URL);
    console.log('Request body:', body);

    const response = await fetch(FAUCET_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果需要添加认证头
        ...(process.env.FAUCET_API_KEY && {
          'Authorization': `Bearer ${process.env.FAUCET_API_KEY}`
        })
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    console.log('Faucet API response:', data);

    // 返回原始响应
    return NextResponse.json(data, {
      status: response.status
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        error: '500',
        err_msg: 'Internal server error',
        message: 'Failed to proxy request to faucet API'
      },
      { status: 500 }
    );
  }
} 