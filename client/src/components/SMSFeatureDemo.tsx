import { useTranslation } from "react-i18next";
import { Smartphone, Info, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";

const SMSFeatureDemo = () => {
  const { t } = useTranslation();
  const [activeDemoIndex, setActiveDemoIndex] = useState(0);
  
  const demoCommands = [
    {
      command: "PRICE TOMATO",
      response: "Current tomato prices: ₹25-30/kg in Pune, ₹22-28/kg in Nashik, ₹26-32/kg in Mumbai. Reply with BUY + listing ID to purchase.",
      explanation: t('sms.check.price')
    },
    {
      command: "SELL RICE 100KG 40",
      response: "Your listing for 100KG Rice at ₹40/kg has been posted! Listing ID: #4872. Potential buyers will contact you directly.",
      explanation: t('sms.list.crop')
    },
    {
      command: "BUY 1234",
      response: "You've expressed interest in Listing #1234: 50KG Onions at ₹18/kg. Seller contact: Ramesh (+91 9876543210). SMS CONFIRM 1234 to complete purchase.",
      explanation: t('sms.buy.crop')
    }
  ];
  
  const nextDemo = () => {
    setActiveDemoIndex((prev) => (prev + 1) % demoCommands.length);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 mb-8 border border-indigo-100">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center">
          <Smartphone className="text-indigo-600 h-6 w-6 mr-2" />
          <h2 className="text-xl font-bold text-indigo-700">{t('sms.title')}</h2>
          <div className="ml-2 bg-indigo-600 text-white text-xs py-1 px-2 rounded-full">Feature</div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{t('sms.description')}</p>
      
      {/* Phone mockup */}
      <div className="border-2 border-gray-300 rounded-xl p-3 bg-white mb-6 shadow-md max-w-sm mx-auto">
        <div className="flex items-center border-b border-gray-200 pb-2 mb-3">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-lg">A</span>
          </div>
          <div className="ml-3">
            <p className="font-bold text-gray-800">AgriNet SMS</p>
            <p className="text-xs text-gray-500">+91 1234 567890</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-4 min-h-[200px]">
          {/* System message */}
          <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
            <p className="text-sm">Welcome to AgriNet SMS service! Text commands to buy/sell crops or check prices.</p>
          </div>
          
          {/* User message */}
          <div className="bg-indigo-100 p-3 rounded-lg rounded-tr-none max-w-[80%] ml-auto text-right">
            <p className="text-sm font-medium">{demoCommands[activeDemoIndex].command}</p>
          </div>
          
          {/* Response message */}
          <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
            <p className="text-sm">{demoCommands[activeDemoIndex].response}</p>
            <p className="text-xs text-gray-500 mt-1 text-right">Delivered <CheckCircle className="inline-block h-3 w-3 ml-1" /></p>
          </div>
        </div>
        
        <button 
          onClick={nextDemo}
          className="w-full flex items-center justify-center py-2 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-600 text-sm font-medium"
        >
          Try next command <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-indigo-100 p-4 shadow-sm mb-4">
        <h3 className="font-bold text-gray-800 mb-2">Available Commands:</h3>
        <ul className="space-y-2">
          <li className="flex">
            <code className="bg-gray-100 text-indigo-700 px-2 py-1 rounded text-sm font-mono mr-2 min-w-[160px]">PRICE [crop name]</code>
            <span className="text-sm text-gray-600">{t('sms.check.price')}</span>
          </li>
          <li className="flex">
            <code className="bg-gray-100 text-indigo-700 px-2 py-1 rounded text-sm font-mono mr-2 min-w-[160px]">SELL [crop] [qty] [price]</code>
            <span className="text-sm text-gray-600">{t('sms.list.crop')}</span>
          </li>
          <li className="flex">
            <code className="bg-gray-100 text-indigo-700 px-2 py-1 rounded text-sm font-mono mr-2 min-w-[160px]">BUY [listing ID]</code>
            <span className="text-sm text-gray-600">{t('sms.buy.crop')}</span>
          </li>
        </ul>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-neutral-dark">{t('sms.send.to')}</h3>
        <span className="font-bold text-indigo-600">+91 1234 567890</span>
      </div>
      
      <button 
        onClick={() => alert('SMS service allows farmers without smartphones or internet to access the AgriNet marketplace. They can check prices, buy, and sell crops using simple text messages in their local language.')}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-semibold transition duration-300 flex items-center justify-center"
      >
        <Info className="mr-2 h-5 w-5" /> {t('sms.learn.more')}
      </button>
    </div>
  );
};

export default SMSFeatureDemo;
