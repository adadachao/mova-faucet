'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import Web3 from 'web3';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(''); // 清空默认值，让用户输入
  const [activeNav, setActiveNav] = useState('mova-bridge'); // 当前选中的导航项
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 移动端菜单状态
  const [isLoading, setIsLoading] = useState(false); // 加载状态

  // 使用Web3.js验证地址
  const isValidWeb3Address = (address: string): boolean => {
    try {
      // 首先检查基本格式
      if (!Web3.utils.isAddress(address)) {
        return false;
      }
      
      // 尝试转换为校验和地址，如果失败则说明地址无效
      try {
        Web3.utils.toChecksumAddress(address);
        return true;
      } catch (checksumError) {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const handleGetTokens = async () => {
    const trimmedAddress = walletAddress.trim();
    
    if (!trimmedAddress) {
      toast.error('Please enter a wallet address');
      return;
    }

    // 尝试标准化地址
    let normalizedAddress = trimmedAddress;
    
    // 正确的地址验证方法
    try {
      // 首先转换为小写进行基本验证
      const lowerAddress = trimmedAddress.toLowerCase();
      if (!Web3.utils.isAddress(lowerAddress)) {
        toast.error('Please enter a valid Web3 wallet address');
        return;
      }
      
      // 然后尝试转换为正确的校验和地址
      normalizedAddress = Web3.utils.toChecksumAddress(lowerAddress);
      
    } catch (error) {
      toast.error('Please enter a valid Web3 wallet address');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Sending testnet tokens...');

    try {
      const response = await fetch('/api/faucet/v1/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: normalizedAddress
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.error && data.error !== "200") {
          toast.error(`Transfer failed: ${data.err_msg || data.data || 'Server error'}`, { id: loadingToast });
        } else {
          toast.success('Testnet tokens sent successfully!', { id: loadingToast });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Transfer failed:', errorData);
        toast.error(`Transfer failed: ${errorData.err_msg || errorData.message || response.statusText}`, { id: loadingToast });
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error. Please try again.', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectSocial = (platform: 'x' | 'discord') => {
    console.log(`Connecting to ${platform}`);
  };

  const handleAddTestnet = () => {
    console.log('Adding testnet to wallet');
  };

  const handleNavClick = (navItem: string) => {
    setActiveNav(navItem);
    setIsMobileMenuOpen(false); // 点击后关闭移动端菜单
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toast通知 */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />

      {/* 导航栏 */}
      <nav className="w-full flex justify-between items-center bg-[#D9D9D9] text-black h-[82px] px-4 md:px-32 lg:px-40 py-4">
        <div className="flex items-center">
          <Image src="/mova-logo.svg" alt="MOVA" width={80} height={28} className="md:w-[100px] md:h-[35px]" />
        </div>
        
        {/* 桌面端导航 */}
        <div className="hidden md:flex gap-4 lg:gap-8">
          <a 
            href="https://www.movachain.com/"
            target="_blank"
            onClick={() => handleNavClick('home')}
            className={`text-sm font-medium transition-colors ${
              activeNav === 'home' 
                ? 'text-white font-semibold' 
                : 'text-black font-semibold hover:text-white'
            }`}
          >
            Home
          </a>
          <a 
            href="#" 
            onClick={() => handleNavClick('mova-bridge')}
            className={`text-sm font-medium transition-colors ${
              activeNav === 'mova-bridge' 
                ? 'text-white font-semibold' 
                : 'text-black font-semibold hover:text-white'
            }`}
          >
            Mova Bridge
          </a>
        </div>

        {/* 移动端菜单按钮 */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#D9D9D9] border-t border-gray-300">
          <div className="flex flex-col py-4 px-4 space-y-3">
            <a 
              href="https://www.movachain.com/"
              target="_blank"
              onClick={() => handleNavClick('home')}
              className={`text-sm font-medium transition-colors py-2 ${
                activeNav === 'home' 
                  ? 'text-white font-semibold' 
                  : 'text-black hover:text-white'
              }`}
            >
              Home
            </a>
            <a 
              href="#" 
              onClick={() => handleNavClick('mova-bridge')}
              className={`text-sm font-medium transition-colors py-2 ${
                activeNav === 'mova-bridge' 
                  ? 'text-white font-semibold' 
                  : 'text-black hover:text-white'
              }`}
            >
              Mova Bridge
            </a>
          </div>
        </div>
      )}

      {/* 主内容区域 */}
      <main className="flex-1 bg-[#1A1A1A]">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-10">
          {/* 标题区域 */}
          <div className="flex justify-center mb-6 md:mb-6">
            <div className="relative">
              <Image 
                src="/mova-logo-banner.svg" 
                alt="MOVA" 
                width={280} 
                height={102} 
                className="md:w-[361px] md:h-[132px]"
                priority 
              />
              <div className="absolute -right-16 md:-right-26 top-4 md:top-6 bg-[#C1FF72] text-black px-4 md:px-8 py-1 rounded-full text-sm md:text-lg font-semibold">
                Faucet
              </div>
            </div>
          </div>

          {/* 主要卡片 */}
          <div className="max-w-5xl mx-auto bg-gradient-to-b from-black to-[#231F20] rounded-xl p-4 md:p-8 mb-8 md:mb-12 shadow-[0_10px_9.4px_-2px_rgba(0,0,0,0.25)]">
            <h2 className="text-lg md:text-md font-semibold mb-4 md:mb-2 text-[#D9D9D9]">Enter wallet address</h2>
            
            <div className="mb-4 md:mb-2">
              <div className="flex items-center bg-[#212121] rounded-[5px] overflow-hidden h-[36px]">
                {/* 前面的图标 */}
                <div className="flex items-center justify-center w-10 h-full bg-[#212121]">
                  <Image src="/wallet_icon.svg" alt="Wallet" width={24} height={24} />
                </div>
                {/* 输入框 */}
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="flex-1 bg-[#212121] px-2 py-2 text-white placeholder-gray-400 focus:outline-none text-sm"
                  placeholder="0x8ce78...28161"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              onClick={handleGetTokens}
              disabled={isLoading}
              className={`w-full cursor-pointer bg-[#C1FF72] text-black font-semibold py-2 md:py-2 rounded-lg transition-colors mb-4 text-sm md:text-base ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#B8F066]'
              }`}
            >
              {isLoading ? 'Sending...' : 'Get Testnet MOVA'}
            </button>

            <p className="text-[#D9D9D9] text-xs md:text-xs text-center mb-6 md:mb-8">
              Testnet tokens are for development purposes only, they do not have real value.
            </p>

            {/* <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-center text-white">Connect your social media accounts to get more tokens</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <button
                onClick={() => handleConnectSocial('x')}
                className="bg-[#292C1F] cursor-pointer hover:bg-[#5B733A] text-white font-medium py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
              >
                Connect X
              </button>
              <button
                onClick={() => handleConnectSocial('discord')}
                className="bg-[#292C1F] cursor-pointer hover:bg-[#5B733A] text-white font-medium py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base"
              >
                Connect Discord
              </button>
            </div>

            <p className="text-gray-400 text-xs md:text-sm text-center">
              New here? <a href="#" onClick={handleAddTestnet}>Add Testnet to your wallet.</a>
            </p> */}
          </div>

          {/* FAQ 部分 */}
          <div className="max-w-5xl mx-auto">
            <h2 className="underline text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 text-white">Frequently Asked Questions</h2>
            
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-base md:text-lg font-semibold text-[#C1FF72] mb-2 underline">
                  What is the Mova Faucet?
                </h3>
                <p className="text-[#fff] leading-relaxed text-sm md:text-base underline">
                  Testnet users are encouraged to use the Mova Faucet to obtain Testnet tokens for use on the Mova Testnet network. The faucet is designed to distribute tokens to new or depleted users.
                </p>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-semibold text-[#C1FF72] mb-2 underline">
                  How do I get more tokens?
                </h3>
                <p className="text-[#fff] leading-relaxed font- text-sm md:text-base underline">
                  Subject to eligibility requirements, users can claim tokens from the Mova Faucet every 6 hours. Active members of the Mova community may be eligible for larger token allocations by connecting Discord and Twitter accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
