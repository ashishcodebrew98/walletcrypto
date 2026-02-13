(function () {
  const e = React.createElement;
  const { useMemo, useState } = React;

  const screens = {
    WELCOME: 'welcome',
    PHONE: 'phone',
    OTP: 'otp',
    EMAIL: 'email',
    PIN_CREATE: 'pinCreate',
    PIN_CONFIRM: 'pinConfirm',
    BIOMETRIC: 'biometric',
    KYC_INTRO: 'kycIntro',
    KYC_L1: 'kycL1',
    KYC_L2: 'kycL2',
    KYC_STATUS: 'kycStatus',
    DASHBOARD: 'dashboard'
  };

  const mock = {
    authOptions: [
      { id: 'phone', label: 'Continue with Phone Number', icon: '📱' },
      { id: 'email', label: 'Continue with Email', icon: '✉️' },
      { id: 'google', label: 'Continue with Google', icon: '🟢' },
      { id: 'microsoft', label: 'Continue with Microsoft', icon: '🪟' }
    ],
    wallets: [
      { id: 'ngn', name: 'Naira Wallet', amount: '₦850,000.00', meta: 'Available balance', style: 'wallet-ngn' },
      { id: 'usd', name: 'Dollar Wallet', amount: '$1,280.00', meta: 'Available balance', style: 'wallet-usd' },
      { id: 'btc', name: 'Bitcoin Wallet', amount: '0.0245 BTC', meta: '≈ ₦1,102,500', style: 'wallet-btc' },
      { id: 'eth', name: 'Ethereum Wallet', amount: '1.93 ETH', meta: '≈ ₦8,342,050', style: 'wallet-eth' },
      { id: 'usdt', name: 'USDT Wallet', amount: '4,000 USDT', meta: 'TRC20', style: 'wallet-usdt' }
    ],
    actions: ['Add Funds', 'Exchange', 'Send Money', 'Pay Bills', 'Gift Cards', 'Airtime/Data'],
    tx: [
      { id: 1, title: 'Bank Deposit', sub: 'From GTBank • 2:45 PM', amount: '+₦50,000', type: 'positive' },
      { id: 2, title: 'Gift Card Exchange', sub: 'Amazon $100 • 12:10 PM', amount: '+₦84,000', type: 'positive' },
      { id: 3, title: 'Electricity Bill', sub: 'Ikeja Electric • 9:20 AM', amount: '-₦25,000', type: 'negative' }
    ]
  };

  function Header(props) {
    return e('header', { className: 'flow-header' }, [
      props.back ? e('button', { key: 'b', className: 'icon-btn', onClick: props.back, 'aria-label': 'Go back' }, '←') : e('span', { key: 's' }),
      e('h2', { key: 't' }, props.title),
      e('span', { key: 'r' })
    ]);
  }

  function Welcome({ go }) {
    return e('section', { className: 'screen' }, [
      e('div', { className: 'hero', key: 'h' }, [
        e('div', { className: 'app-logo', key: 'l' }, '₦₿'),
        e('p', { className: 'muted', key: 'm' }, 'Your gateway to seamless digital finance'),
        e('h1', { key: 't' }, 'Get Started')
      ]),
      e('div', { className: 'stack', key: 'a' }, mock.authOptions.map((o) =>
        e('button', { key: o.id, className: `btn ${o.id === 'phone' ? 'btn-primary' : 'btn-secondary'}`, onClick: () => go(o.id === 'email' ? screens.EMAIL : screens.PHONE) }, `${o.icon} ${o.label}`)
      )),
      e('p', { className: 'center muted', key: 'f' }, ['Already have an account? ', e('a', { href: '#', key: 'l' }, 'Login')])
    ]);
  }

  function Phone({ go, data, setData }) {
    const valid = /^\d{10}$/.test(data.phone);
    return e('section', { className: 'screen' }, [
      e(Header, { key: 'h', title: 'Enter Your Phone Number', back: () => go(screens.WELCOME) }),
      e('p', { className: 'muted', key: 's' }, "We'll send you a verification code"),
      e('label', { key: 'l1' }, 'COUNTRY'),
      e('input', { key: 'i1', value: '+234 (Nigeria)', readOnly: true }),
      e('label', { key: 'l2' }, 'PHONE NUMBER'),
      e('input', {
        key: 'i2', type: 'tel', placeholder: '8012345678', value: data.phone,
        onChange: (ev) => setData((p) => Object.assign({}, p, { phone: ev.target.value.replace(/\D/g, '').slice(0, 10) }))
      }),
      e('small', { className: 'muted', key: 'x' }, 'Enter your 10-digit phone number'),
      e('button', { key: 'b', className: 'btn btn-primary', disabled: !valid, onClick: () => go(screens.OTP) }, 'Send OTP')
    ]);
  }

  function OTP({ go, data, setData }) {
    const valid = data.otp.length === 6;
    return e('section', { className: 'screen' }, [
      e(Header, { key: 'h', title: 'Enter Verification Code', back: () => go(screens.PHONE) }),
      e('p', { className: 'muted', key: 's' }, `Code sent to +234 ${data.phone || '8012345678'}`),
      e('input', {
        key: 'otp', className: 'otp', inputMode: 'numeric', maxLength: 6, placeholder: '••••••', value: data.otp,
        onChange: (ev) => setData((p) => Object.assign({}, p, { otp: ev.target.value.replace(/\D/g, '').slice(0, 6) }))
      }),
      e('p', { className: 'error-ish', key: 't' }, 'Valid for 2:45'),
      e('button', { key: 'b', className: 'btn btn-primary', disabled: !valid, onClick: () => go(screens.PIN_CREATE) }, 'Verify OTP')
    ]);
  }

  function Email({ go, data, setData }) {
    const strong = data.password.length >= 8 && /[A-Z]/.test(data.password) && /\d/.test(data.password) && /[^A-Za-z0-9]/.test(data.password);
    const valid = /.+@.+\..+/.test(data.email) && strong;
    return e('section', { className: 'screen' }, [
      e(Header, { key: 'h', title: 'Create Account', back: () => go(screens.WELCOME) }),
      e('label', { key: 'l1' }, 'EMAIL ADDRESS'),
      e('input', { key: 'i1', type: 'email', value: data.email, placeholder: 'you@example.com', onChange: (ev) => setData((p) => Object.assign({}, p, { email: ev.target.value })) }),
      e('label', { key: 'l2' }, 'PASSWORD'),
      e('input', { key: 'i2', type: 'password', value: data.password, placeholder: 'Create a strong password', onChange: (ev) => setData((p) => Object.assign({}, p, { password: ev.target.value })) }),
      e('small', { className: strong ? 'success-ish' : 'muted', key: 's' }, strong ? 'Strong password' : 'Use 8+ chars, uppercase, number, special char'),
      e('button', { key: 'b', className: 'btn btn-primary', disabled: !valid, onClick: () => go(screens.PIN_CREATE) }, 'Create Account')
    ]);
  }

  function PinCreate({ go, data, setData }) {
    return e('section', { className: 'screen center' }, [
      e(Header, { key: 'h', title: 'Secure Your Account', back: () => go(data.email ? screens.EMAIL : screens.OTP) }),
      e('p', { className: 'muted', key: 's' }, 'Create a 6-digit PIN for quick transactions'),
      e('input', { key: 'pin', className: 'otp', maxLength: 6, inputMode: 'numeric', value: data.pin, onChange: (ev) => setData((p) => Object.assign({}, p, { pin: ev.target.value.replace(/\D/g, '').slice(0, 6) })) }),
      e('button', { key: 'b', className: 'btn btn-primary', disabled: data.pin.length !== 6, onClick: () => go(screens.PIN_CONFIRM) }, 'Continue')
    ]);
  }

  function PinConfirm({ go, data, setData }) {
    const match = data.pin.length === 6 && data.pinConfirm === data.pin;
    return e('section', { className: 'screen center' }, [
      e(Header, { key: 'h', title: 'Confirm Your PIN', back: () => go(screens.PIN_CREATE) }),
      e('input', { key: 'pin', className: 'otp', maxLength: 6, inputMode: 'numeric', value: data.pinConfirm, onChange: (ev) => setData((p) => Object.assign({}, p, { pinConfirm: ev.target.value.replace(/\D/g, '').slice(0, 6) })) }),
      data.pinConfirm.length === 6 ? e('p', { key: 'm', className: match ? 'success-ish' : 'error-ish' }, match ? 'PIN created successfully!' : "PINs don't match") : null,
      e('button', { key: 'b', className: 'btn btn-primary', disabled: !match, onClick: () => go(screens.BIOMETRIC) }, 'Continue')
    ]);
  }

  function Biometric({ go }) {
    return e('section', { className: 'screen center' }, [
      e(Header, { key: 'h', title: 'Enable Biometric Login', back: () => go(screens.PIN_CONFIRM) }),
      e('div', { className: 'bio', key: 'i' }, '🛡️'),
      e('p', { className: 'muted', key: 's' }, 'Use Face ID/Fingerprint for faster and more secure access'),
      e('button', { key: 'b1', className: 'btn btn-primary', onClick: () => go(screens.KYC_INTRO) }, 'Enable Biometric'),
      e('button', { key: 'b2', className: 'btn btn-text', onClick: () => go(screens.KYC_INTRO) }, 'Skip for Now')
    ]);
  }

  function KycIntro({ go }) {
    return e('section', { className: 'screen' }, [
      e(Header, { key: 'h', title: 'Verify Your Identity', back: () => go(screens.BIOMETRIC) }),
      e('p', { className: 'muted', key: 's' }, 'Step 1 of 2 • Complete KYC to unlock all features'),
      e('article', { className: 'card', key: 'c1' }, [e('h3', { key: 't' }, 'Level 1: Basic Profile'), e('p', { className: 'muted', key: 'd' }, '₦50,000 daily limit')]),
      e('article', { className: 'card', key: 'c2' }, [e('h3', { key: 't' }, 'Level 2: Full Verification'), e('p', { className: 'muted', key: 'd' }, 'Unlimited transactions')]),
      e('button', { key: 'b1', className: 'btn btn-primary', onClick: () => go(screens.KYC_L1) }, 'Start Verification'),
      e('button', { key: 'b2', className: 'btn btn-text', onClick: () => go(screens.DASHBOARD) }, "I'll do this later")
    ]);
  }

  function KycL1({ go, data, setData }) {
    const valid = data.fullName && data.dob && data.gender && data.address;
    return e('section', { className: 'screen' }, [
      e(Header, { key: 'h', title: 'Step 1 of 2 • Basic Profile', back: () => go(screens.KYC_INTRO) }),
      e('label', { key: 'n1' }, 'FULL NAME *'),
      e('input', { key: 'n2', value: data.fullName, onChange: (ev) => setData((p) => Object.assign({}, p, { fullName: ev.target.value })) }),
      e('label', { key: 'd1' }, 'DATE OF BIRTH *'),
      e('input', { key: 'd2', type: 'date', value: data.dob, onChange: (ev) => setData((p) => Object.assign({}, p, { dob: ev.target.value })) }),
      e('label', { key: 'g1' }, 'GENDER *'),
      e('select', { key: 'g2', value: data.gender, onChange: (ev) => setData((p) => Object.assign({}, p, { gender: ev.target.value })) }, [
        e('option', { key: 'o0', value: '' }, 'Select'),
        e('option', { key: 'o1', value: 'male' }, 'Male'),
        e('option', { key: 'o2', value: 'female' }, 'Female'),
        e('option', { key: 'o3', value: 'other' }, 'Other')
      ]),
      e('label', { key: 'a1' }, 'RESIDENTIAL ADDRESS *'),
      e('textarea', { key: 'a2', value: data.address, maxLength: 200, onChange: (ev) => setData((p) => Object.assign({}, p, { address: ev.target.value })) }),
      e('button', { key: 'b', className: 'btn btn-primary', disabled: !valid, onClick: () => go(screens.KYC_L2) }, 'Continue')
    ]);
  }

  function KycL2({ go, data, setData }) {
    const valid = /^\d{11}$/.test(data.idNumber) && data.idDoc && data.addressDoc && data.selfie;
    return e('section', { className: 'screen' }, [
      e(Header, { key: 'h', title: 'Step 2 of 2 • Advanced Verification', back: () => go(screens.KYC_L1) }),
      e('p', { className: 'warn-box', key: 'w' }, 'This verification usually takes 2-24 hours.'),
      e('label', { key: 't1' }, 'ID TYPE'),
      e('select', { key: 't2', value: data.idType, onChange: (ev) => setData((p) => Object.assign({}, p, { idType: ev.target.value })) }, [
        e('option', { value: 'bvn', key: 'b' }, 'BVN'), e('option', { value: 'nin', key: 'n' }, 'NIN')
      ]),
      e('label', { key: 'i1' }, 'ENTER YOUR BVN/NIN *'),
      e('input', { key: 'i2', inputMode: 'numeric', maxLength: 11, value: data.idNumber, onChange: (ev) => setData((p) => Object.assign({}, p, { idNumber: ev.target.value.replace(/\D/g, '').slice(0, 11) })) }),
      e('label', { key: 'd1' }, 'GOVERNMENT ID UPLOADED? *'),
      e('input', { key: 'd2', type: 'checkbox', checked: data.idDoc, onChange: (ev) => setData((p) => Object.assign({}, p, { idDoc: ev.target.checked })) }),
      e('label', { key: 'a1' }, 'PROOF OF ADDRESS UPLOADED? *'),
      e('input', { key: 'a2', type: 'checkbox', checked: data.addressDoc, onChange: (ev) => setData((p) => Object.assign({}, p, { addressDoc: ev.target.checked })) }),
      e('label', { key: 's1' }, 'SELFIE CAPTURED? *'),
      e('input', { key: 's2', type: 'checkbox', checked: data.selfie, onChange: (ev) => setData((p) => Object.assign({}, p, { selfie: ev.target.checked })) }),
      e('button', { key: 'b', className: 'btn btn-primary', disabled: !valid, onClick: () => go(screens.KYC_STATUS) }, 'Submit for Review')
    ]);
  }

  function KycStatus({ go }) {
    return e('section', { className: 'screen center' }, [
      e(Header, { key: 'h', title: 'KYC Status', back: () => go(screens.KYC_L2) }),
      e('div', { className: 'status-icon', key: 'i' }, '⏳'),
      e('h3', { key: 't' }, 'Under Review'),
      e('p', { className: 'muted', key: 'd' }, 'Your documents are being reviewed. This usually takes 2-24 hours.'),
      e('article', { className: 'card', key: 'c' }, [e('h4', { key: 'h' }, 'Current Access Level'), e('p', { key: 'p' }, '₦50,000 / day • Basic wallet, Airtime, Bills')]),
      e('button', { key: 'b1', className: 'btn btn-primary', onClick: () => go(screens.DASHBOARD) }, 'Continue to Dashboard')
    ]);
  }

  function Dashboard({ go, tab, setTab }) {
    const tabBody = tab === 'home'
      ? [
          e('article', { className: 'portfolio', key: 'p' }, [e('p', { key: 'a' }, 'Total Portfolio Value'), e('h3', { key: 'b' }, '₦2,450,000.00'), e('p', { className: 'success-ish', key: 'c' }, '↑ ₦45,000 (+1.87%)')]),
          e('div', { className: 'wallet-scroll', key: 'w' }, mock.wallets.map((w) => e('article', { key: w.id, className: `wallet ${w.style}` }, [e('h4', { key: 'n' }, w.name), e('p', { className: 'amount', key: 'a' }, w.amount), e('small', { key: 'm' }, w.meta)]))),
          e('h3', { key: 'q' }, 'Quick Actions'),
          e('div', { className: 'quick-grid', key: 'qa' }, mock.actions.map((a) => e('button', { key: a, className: 'quick-action' }, a))),
          e('h3', { key: 'r' }, 'Recent Activity'),
          e('ul', { className: 'transactions', key: 't' }, mock.tx.map((x) => e('li', { className: 'transaction-item', key: x.id }, [e('div', { key: 'l' }, [e('p', { className: 'tx-title', key: 't' }, x.title), e('small', { className: 'muted', key: 's' }, x.sub)]), e('p', { className: `tx-amount ${x.type}`, key: 'a' }, x.amount)])))
        ]
      : [e('div', { className: 'card', key: 'c' }, `${tab[0].toUpperCase() + tab.slice(1)} module mock content`)];

    return e('section', { className: 'screen' }, [
      e('header', { className: 'dash-top', key: 'h' }, [
        e('button', { className: 'icon-btn', key: 'p', onClick: () => go(screens.KYC_STATUS) }, '👤'),
        e('h2', { key: 't' }, 'Home Dashboard'),
        e('button', { className: 'icon-btn', key: 'n' }, '🔔')
      ]),
      e('article', { className: 'kyc-banner', key: 'k' }, [e('span', { key: 's' }, '⚠️ Complete KYC to unlock all features'), e('button', { className: 'btn-link', key: 'b', onClick: () => go(screens.KYC_INTRO) }, 'Verify now')]),
      ...tabBody,
      e('nav', { className: 'bottom-nav', key: 'bn' }, ['home', 'wallets', 'exchange', 'more'].map((x) => e('button', { key: x, className: `tab ${tab === x ? 'active' : ''}`, onClick: () => setTab(x), role: 'tab', 'aria-selected': tab === x ? 'true' : 'false' }, x))),
      e('button', { className: 'fab', key: 'f', onClick: () => setTab('exchange'), 'aria-label': 'Quick Exchange' }, '⇄')
    ]);
  }

  function App() {
    const [screen, setScreen] = useState(screens.WELCOME);
    const [dashTab, setDashTab] = useState('home');
    const [data, setData] = useState({
      phone: '', otp: '', email: '', password: '', pin: '', pinConfirm: '',
      fullName: '', dob: '', gender: '', address: '',
      idType: 'bvn', idNumber: '', idDoc: false, addressDoc: false, selfie: false
    });

    const content = useMemo(() => {
      if (screen === screens.WELCOME) return e(Welcome, { go: setScreen });
      if (screen === screens.PHONE) return e(Phone, { go: setScreen, data, setData });
      if (screen === screens.OTP) return e(OTP, { go: setScreen, data, setData });
      if (screen === screens.EMAIL) return e(Email, { go: setScreen, data, setData });
      if (screen === screens.PIN_CREATE) return e(PinCreate, { go: setScreen, data, setData });
      if (screen === screens.PIN_CONFIRM) return e(PinConfirm, { go: setScreen, data, setData });
      if (screen === screens.BIOMETRIC) return e(Biometric, { go: setScreen });
      if (screen === screens.KYC_INTRO) return e(KycIntro, { go: setScreen });
      if (screen === screens.KYC_L1) return e(KycL1, { go: setScreen, data, setData });
      if (screen === screens.KYC_L2) return e(KycL2, { go: setScreen, data, setData });
      if (screen === screens.KYC_STATUS) return e(KycStatus, { go: setScreen });
      return e(Dashboard, { go: setScreen, tab: dashTab, setTab: setDashTab });
    }, [screen, data, dashTab]);

    return e(React.Fragment, null, [
      e('a', { className: 'skip-link', href: '#main-content', key: 's' }, 'Skip to content'),
      e('main', { id: 'main-content', className: 'app', key: 'm' }, content)
    ]);
  }

  ReactDOM.createRoot(document.getElementById('root')).render(e(App));
})();
