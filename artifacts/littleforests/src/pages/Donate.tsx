import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  ShieldCheck,
  TreePine,
  Droplets,
  Sprout,
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  Users,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import AuthButton from '@/components/AuthButton';
import NavigationDropdown from '@/components/NavigationDropdown';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import CartSidebar from '@/components/CartSidebar';
import { useCart } from '@/contexts/CartContext';
import BrandMark from '@/components/BrandMark';
import nurseryImage from '@assets/For Front page_1751302445978.jpg';

type Choice = 'adopt' | 'start';
type Payment = 'mpesa' | 'card' | 'paypal';
type Frequency = 'once' | 'monthly';

const options: Record<Choice, {
  title: string;
  shortTitle: string;
  description: string;
  amounts: number[];
}> = {
  adopt: {
    title: 'Donate to Adopt a LittleForest',
    shortTitle: 'Adopt a LittleForest',
<<<<<<< HEAD
    description: 'Support an existing LittleForest as it grows around its water source.',
=======
    description:
      'Support an existing LittleForest established around a water source. Your contribution helps us continue planting, replace seedlings where needed and care for the trees as the LittleForest grows.',
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
    amounts: [25, 50, 100, 250],
  },
  start: {
    title: 'Donate to Start a LittleForest',
    shortTitle: 'Start a LittleForest',
<<<<<<< HEAD
    description: 'Help establish a new LittleForest around a water source.',
=======
    description:
      'Help establish a new LittleForest around a water source. Your contribution supports the initial planting of indigenous trees and their care as the young LittleForest becomes established.',
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
    amounts: [250, 500, 1000, 2500],
  },
};

const paymentInfo: Record<Payment, { title: string; subtitle: string; detail: string }> = {
  mpesa: {
    title: 'M-Pesa',
    subtitle: 'For donors in Kenya',
    detail: 'At live checkout, you will enter your M-Pesa number and receive an STK push to confirm your donation.',
  },
  card: {
    title: 'Card',
    subtitle: 'Visa and Mastercard',
    detail: 'Card details will be entered securely through the selected payment provider. Little Forests should not store full card details.',
  },
  paypal: {
    title: 'PayPal',
    subtitle: 'For international donors',
    detail: 'International donors can continue to PayPal to sign in and confirm their contribution through PayPal’s secure checkout.',
  },
};

const Donate = () => {
  const navigate = useNavigate();
  const { getCartTotal } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [choice, setChoice] = useState<Choice>('adopt');
  const [amount, setAmount] = useState(100);
  const [custom, setCustom] = useState('');
  const [payment, setPayment] = useState<Payment>('mpesa');
  const [frequency, setFrequency] = useState<Frequency>('once');
  const [message, setMessage] = useState('');

  const selected = options[choice];
  const selectedAmount = custom ? Number(custom) || 0 : amount;

  const impactText = useMemo(() => {
    if (choice === 'adopt') {
      return 'Your support helps an existing LittleForest continue to grow around its water source.';
    }
    return 'Your support helps us establish a new LittleForest around a water source that needs restoration.';
  }, [choice]);

  const selectChoice = (next: Choice) => {
    setChoice(next);
    setCustom('');
    setAmount(options[next].amounts[0]);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white relative overflow-x-hidden">
      <SEO
        title="Donate — Support Reforestation | LittleForest Nursery Kenya"
        description="Support LittleForest Nursery's mission to restore water catchments and plant indigenous trees across Kenya. Every donation helps grow more Little Forests."
        path="/donate"
      />
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <BrandMark />
            </Link>
            <div className="flex items-center space-x-3">
              <AuthButton />
              <Button
                onClick={() => navigate('/')}
                className="bg-orange-500 hover:bg-orange-600 text-white hover:scale-105 transition-transform duration-200"
              >
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="fixed top-20 left-4 z-40">
        <div className="scale-110"><NavigationDropdown /></div>
      </div>

      <div className="fixed top-20 right-4 z-40">
        <Button
          onClick={() => setCartOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white relative shadow-lg hover:scale-105 transition-transform duration-200 scale-110"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart
          {getCartTotal() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500 hover:bg-orange-600 border-2 border-white">
              {getCartTotal()}
            </Badge>
          )}
        </Button>
      </div>

      <div className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white shadow-lg transition-transform duration-300 ease-in-out z-[60] ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </div>

      <main>
        <section
<<<<<<< HEAD
           className="relative py-10 md:py-20 overflow-hidden"
=======
          className="relative py-14 md:py-20 overflow-hidden"
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
          style={{ backgroundImage: `url(${nurseryImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300 mb-4">Support Little Forests</p>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
                Your contribution helps us plant and care for indigenous trees around water sources, one LittleForest at a time.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Button onClick={() => scrollTo('support')} className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3">
                  Donate Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={() => scrollTo('how-it-helps')} variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-green-800 px-7 py-3">
                  How it helps
                </Button>
              </div>
            </div>
          </div>
        </section>

<<<<<<< HEAD
         <section id="support" className="py-10 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-6 md:mb-10">
               <h3 className="text-2xl md:text-4xl font-bold text-green-800">What would you like to support?</h3>
               <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto">Choose an existing LittleForest or help establish a new one.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
=======
        <section id="support" className="py-14 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h3 className="text-3xl md:text-4xl font-bold text-green-800">What would you like to support?</h3>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Choose whether you want to support an existing LittleForest or help establish a new one.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
              {(['adopt', 'start'] as Choice[]).map((key) => {
                const active = choice === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectChoice(key)}
<<<<<<< HEAD
                    aria-pressed={active}
                    aria-label={`Select ${options[key].shortTitle}`}
                     className={`relative flex h-full flex-col rounded-2xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 sm:p-7 ${active ? (key === 'adopt' ? 'border-green-600 bg-green-50 shadow-md' : 'border-orange-500 bg-orange-50 shadow-md') : 'border-gray-200 bg-white hover:border-green-300'}`}
                  >
                    {active && <CheckCircle2 className={`absolute right-3 top-3 h-5 w-5 sm:right-5 sm:top-5 sm:h-6 sm:w-6 ${key === 'adopt' ? 'text-green-700' : 'text-orange-600'}`} />}
                     <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full sm:mb-5 sm:h-12 sm:w-12 ${key === 'adopt' ? 'bg-green-100' : 'bg-orange-100'}`}>
                      {key === 'adopt' ? <TreePine className="h-5 w-5 text-green-700 sm:h-6 sm:w-6" /> : <Sprout className="h-5 w-5 text-orange-600 sm:h-6 sm:w-6" />}
                    </div>
                    <h4 className="pr-5 text-base font-bold leading-tight text-gray-900 sm:text-xl">{options[key].shortTitle}</h4>
                     <p className="mt-1 text-xs leading-5 text-gray-600 sm:mt-3 sm:text-sm sm:leading-7">{options[key].description}</p>
=======
                    className={`relative rounded-2xl border-2 p-7 text-left transition-all ${active ? (key === 'adopt' ? 'border-green-600 bg-green-50 shadow-md' : 'border-orange-500 bg-orange-50 shadow-md') : 'border-gray-200 bg-white hover:border-green-300'}`}
                  >
                    {active && <CheckCircle2 className={`absolute right-5 top-5 h-6 w-6 ${key === 'adopt' ? 'text-green-700' : 'text-orange-600'}`} />}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 ${key === 'adopt' ? 'bg-green-100' : 'bg-orange-100'}`}>
                      {key === 'adopt' ? <TreePine className="w-6 h-6 text-green-700" /> : <Sprout className="w-6 h-6 text-orange-600" />}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{options[key].shortTitle}</h4>
                    <p className="text-gray-600 leading-7 mt-3">{options[key].description}</p>
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
                  </button>
                );
              })}
            </div>
          </div>
        </section>

<<<<<<< HEAD
         <section className="py-10 md:py-14 bg-green-50 border-y border-green-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-6 md:mb-9">
               <h3 className="text-2xl md:text-3xl font-bold text-green-800">Choose your contribution</h3>
               <p className="text-sm text-gray-600 mt-2">{impactText}</p>
=======
        <section className="py-14 bg-green-50 border-y border-green-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-9">
              <h3 className="text-3xl font-bold text-green-800">Choose your contribution</h3>
              <p className="text-gray-600 mt-2">{impactText}</p>
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
            </div>

            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-full bg-white border border-green-100 p-1 shadow-sm">
                <button type="button" onClick={() => setFrequency('once')} className={`px-5 py-2 rounded-full text-sm font-semibold ${frequency === 'once' ? 'bg-green-600 text-white' : 'text-gray-600'}`}>Give once</button>
                <button type="button" onClick={() => setFrequency('monthly')} className={`px-5 py-2 rounded-full text-sm font-semibold ${frequency === 'monthly' ? 'bg-green-600 text-white' : 'text-gray-600'}`}><RefreshCw className="inline h-4 w-4 mr-1" /> Give monthly</button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {selected.amounts.map((value) => {
                const active = !custom && amount === value;
                return (
                  <button key={value} type="button" onClick={() => { setAmount(value); setCustom(''); }} className={`rounded-xl border-2 p-5 text-center transition-all ${active ? 'border-green-600 bg-white ring-1 ring-green-600' : 'border-white bg-white hover:border-green-300'}`}>
                    <div className="text-2xl font-bold text-green-700">${value.toLocaleString()}</div>
                  </button>
                );
              })}
            </div>

            <div className="max-w-md mx-auto mt-4">
              <label className="flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-green-500">
                <span className="text-sm font-semibold text-gray-500 mr-3">Other amount</span>
                <span className="font-bold text-gray-500">$</span>
                <input type="number" min="1" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Enter amount" className="min-w-0 flex-1 bg-transparent px-2 text-lg font-bold outline-none" />
              </label>
            </div>
          </div>
        </section>

<<<<<<< HEAD
         <section className="py-10 md:py-14 bg-white" id="payment">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-6 md:mb-8">
               <h3 className="text-2xl md:text-3xl font-bold text-green-800">Choose your payment method</h3>
               <p className="text-sm text-gray-600 mt-2">Secure payment options for donors in Kenya and beyond.</p>
=======
        <section className="py-14 bg-white" id="payment">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-green-800">Choose your payment method</h3>
              <p className="text-gray-600 mt-2">Secure payment options for donors in Kenya and beyond.</p>
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {(Object.keys(paymentInfo) as Payment[]).map((key) => {
                const info = paymentInfo[key];
                const active = payment === key;
                return (
                  <button key={key} type="button" onClick={() => setPayment(key)} className={`rounded-xl border-2 bg-white p-5 text-left transition-all ${active ? 'border-green-600 ring-1 ring-green-600' : 'border-gray-200 hover:border-green-300'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{info.title}</span>
                      <span className={`w-4 h-4 rounded-full border-2 ${active ? 'border-green-600 bg-green-600' : 'border-gray-300'}`} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{info.subtitle}</p>
                  </button>
                );
              })}
            </div>

<<<<<<< HEAD
             <div className="mt-4 bg-green-50 rounded-2xl border border-green-100 p-4 md:p-6">
               <div className="flex gap-3 md:gap-4 items-start">
                 <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
=======
            <div className="mt-5 bg-green-50 rounded-2xl border border-green-100 p-6">
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
                  {payment === 'mpesa' ? <Droplets className="w-5 h-5 text-green-700" /> : payment === 'card' ? <ShieldCheck className="w-5 h-5 text-orange-600" /> : <Heart className="w-5 h-5 text-green-700" />}
                </div>
                <div>
                  <h4 className="font-bold text-green-800">{paymentInfo[payment].title}</h4>
<<<<<<< HEAD
                   <p className="text-sm text-gray-600 mt-1 leading-5 md:leading-6">{paymentInfo[payment].detail}</p>
=======
                  <p className="text-sm text-gray-600 mt-1 leading-6">{paymentInfo[payment].detail}</p>
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
                </div>
              </div>
            </div>

            <div className="mt-6 max-w-2xl mx-auto">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><MessageSquare className="w-4 h-4 text-green-700" /> Add a message (optional)</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={300} placeholder="A short message to accompany your donation" className="w-full min-h-24 rounded-xl border border-gray-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-green-500" />
              <p className="text-right text-xs text-gray-400 mt-1">{message.length}/300</p>
            </div>

            <div className="mt-7 text-center">
              <Button type="button" onClick={() => scrollTo('how-it-helps')} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-6 text-lg rounded-lg">
                Donate ${selectedAmount.toLocaleString()}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="mt-3 text-xs text-gray-500 flex items-center justify-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-600" /> Secure payment processing</p>
            </div>
          </div>
        </section>

<<<<<<< HEAD
         <section id="how-it-helps" className="py-8 md:py-12 bg-green-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-5 md:mb-8">
               <h3 className="text-2xl md:text-3xl font-bold text-green-800">What your support helps us do</h3>
               <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto">Plant trees, restore water sources, and work with local communities.</p>
            </div>
             <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
=======
        <section id="how-it-helps" className="py-14 bg-green-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-green-800">What your support helps us do</h3>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Little Forests are built around water sources, with planting and care continuing as the trees grow.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
              {[
                { icon: <Sprout className="w-6 h-6" />, title: 'Plant indigenous trees', text: 'Plant trees suited to the local environment around water sources.' },
                { icon: <Droplets className="w-6 h-6" />, title: 'Restore water sources', text: 'Support tree planting and care around springs and other water sources.' },
                { icon: <Users className="w-6 h-6" />, title: 'Work with communities', text: 'Support local people involved in protecting and caring for the restored areas.' },
              ].map((item) => (
<<<<<<< HEAD
                 <div key={item.title} className="rounded-xl bg-white border border-green-100 p-3 text-center shadow-sm sm:rounded-2xl sm:p-6">
                   <div className="w-9 h-9 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto mb-2 sm:mb-4 sm:w-12 sm:h-12">{item.icon}</div>
                   <h4 className="font-bold text-green-800 text-xs leading-4 sm:text-lg sm:leading-6">{item.title}</h4>
                   <p className="hidden text-sm text-gray-600 leading-6 mt-2 sm:block">{item.text}</p>
=======
                <div key={item.title} className="rounded-2xl bg-white border border-green-100 p-7 text-center shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto mb-4">{item.icon}</div>
                  <h4 className="font-bold text-green-800 text-lg">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-6 mt-2">{item.text}</p>
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
                </div>
              ))}
            </div>

<<<<<<< HEAD
             <div className="mt-6 rounded-xl bg-white border border-green-100 p-4 md:p-6 flex items-start gap-3 md:items-center md:justify-between md:gap-5">
               <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
               <div className="min-w-0 flex-1">
                 <h4 className="text-base font-bold text-green-800">Clear and accountable</h4>
                 <p className="text-xs text-gray-600 mt-1 leading-5 md:text-sm md:leading-6">Your donation is recorded and acknowledged after successful payment.</p>
              </div>
=======
            <div className="mt-10 rounded-2xl bg-white border border-green-100 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div>
                <h4 className="text-xl font-bold text-green-800">What happens after you give?</h4>
                <p className="text-sm text-gray-600 mt-2 max-w-2xl">Your donation is recorded against the support option you choose. In the live version, you will receive a confirmation and acknowledgement after successful payment.</p>
              </div>
              <div className="shrink-0 flex items-center gap-2 text-sm font-semibold text-green-700"><CheckCircle2 className="w-5 h-5" /> Clear and accountable</div>
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
            </div>
          </div>
        </section>

<<<<<<< HEAD
         <section className="py-8 md:py-12 bg-green-800 text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
             <h3 className="text-2xl md:text-3xl font-bold mb-2">Grow a LittleForest with us</h3>
             <p className="text-sm text-green-100 leading-6 mb-4 md:mb-7">Your support keeps trees growing around water sources.</p>
             <Button onClick={() => scrollTo('support')} className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-2.5">Give today <Heart className="ml-2 w-4 h-4" /></Button>
=======
        <section className="py-12 bg-green-800 text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <h3 className="text-3xl font-bold mb-3">Grow a LittleForest with us</h3>
            <p className="text-green-100 leading-7 mb-7">Whether you adopt an existing LittleForest or help us start a new one, your support keeps trees growing around water sources.</p>
            <Button onClick={() => scrollTo('support')} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">Give today <Heart className="ml-2 w-4 h-4" /></Button>
>>>>>>> 95c8ffdb2e9c18f0fccbce5e86f5122a9459e81f
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Donate;
