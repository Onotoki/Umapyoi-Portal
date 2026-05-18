import React, { useState } from 'react';
import donateMeme from '../assets/donate_meme.jpg';
import donateQr from '../assets/donate_qr.png';

const DonatePage = () => {
  const [copiedText, setCopiedText] = useState('');

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText('');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-inter">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-text-main font-inter mb-3">
          Support Umapyoi
        </h1>
        <p className="text-text-muted max-w-xl mx-auto font-medium text-sm md:text-base">
          Dự án được xây dựng hoàn toàn phi lợi nhuận. Mọi sự ủng hộ từ bạn là động lực to lớn giúp mình duy trì hệ thống và cập nhật thêm nhiều tính năng mới!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        {/* Left Side: Mascot & Info Card */}
        <div className="flex flex-col justify-between bg-card border border-border rounded-3xl p-8 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            {/* Mascot Image */}
            <div className="relative rounded-2xl overflow-hidden mb-6 aspect-square max-w-[280px] mx-auto shadow-md border border-border/50 group-hover:scale-[1.02] transition-transform duration-300">
              <img 
                src={donateMeme} 
                alt="Rice Cat Mascot" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-center">
                <span className="text-xs font-semibold text-white tracking-wide">
                  "Onii-sama... feed me a carrot? 🥕"
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-text-main mb-4 text-center md:text-left">
              Thông Tin Chuyển Khoản
            </h3>
            
            <div className="space-y-4">
              {/* Bank Account Row */}
              <div className="p-4 bg-surface border border-border rounded-2xl flex flex-col gap-3 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text-muted tracking-wider uppercase">Chủ Tài Khoản</span>
                  <span className="text-sm font-extrabold text-text-main">PHẠM QUỐC CƯỜNG</span>
                </div>
                <div className="flex flex-col gap-2 pt-2.5 border-t border-border/55">
                  <span className="text-xs text-text-muted block">Số Tài Khoản (Momo/VietQR)</span>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-base font-extrabold text-primary tracking-wider break-all select-all">
                      PSP2604510700000469
                    </span>
                    <button
                      onClick={() => handleCopy('PSP2604510700000469', 'stk')}
                      className="px-3.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 flex items-center gap-1.5 shadow-sm"
                    >
                      {copiedText === 'stk' ? '✓ Copied' : (
                        <>
                          <span>📋</span>
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Row */}
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                <span className="text-xs font-bold text-primary tracking-wider uppercase block mb-1">Cú pháp chuyển khoản</span>
                <p className="text-sm font-semibold text-text-main">
                  Umapyoi [Tên của bạn]
                </p>
                <span className="text-[10px] text-text-muted mt-1.5 block">
                  Giúp mình dễ dàng ghi nhận đóng góp và hiển thị lời cảm ơn lên bảng vàng!
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/55 text-center md:text-left">
            <span className="text-xs font-semibold text-text-muted block mb-1">📬 Liên hệ / Góp ý</span>
            <a href="mailto:chucuongtn@gmail.com" className="text-sm font-bold text-text-main hover:text-primary transition-colors cursor-pointer">
              chucuongtn@gmail.com
            </a>
          </div>
        </div>

        {/* Right Side: QR Code Card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

          <h3 className="text-xl font-bold text-text-main mb-2">
            Quét Mã QR VietQR
          </h3>
          <p className="text-xs text-text-muted mb-6 max-w-xs">
            Hỗ trợ tất cả các ngân hàng Việt Nam và ví điện tử (Momo, ZaloPay, Viettel Money). Chuyển khoản nhanh 24/7.
          </p>

          {/* QR Image Container */}
          <div className="bg-white p-5 rounded-3xl shadow-lg border border-border max-w-[380px] w-full aspect-square flex items-center justify-center relative group overflow-hidden">
            <img 
              src={donateQr} 
              alt="Donate QR Code" 
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scale(1.65)",
                transformOrigin: "center",
              }}
            />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />
          </div>

          <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full shadow-sm text-xs font-semibold text-text-muted">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Giao dịch an toàn & bảo mật qua Napas247
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
