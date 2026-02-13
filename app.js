(function () {
  const e = React.createElement;
  const { useMemo, useState } = React;

  const views = {
    WELCOME: 'welcome',
    PHONE: 'phone-signup',
    OTP: 'otp',
    EMAIL: 'email-signup',
    PIN_CREATE: 'pin-create',
    PIN_CONFIRM: 'pin-confirm',
    BIOMETRIC: 'biometric',
    KYC_INTRO: 'kyc-intro',
    KYC_L1: 'kyc-l1',
    KYC_L2: 'kyc-l2',
    KYC_STATUS: 'kyc-status',
    DASHBOARD: 'dashboard'
  };

  const mock = {
    wallets: [
      { id: 'ngn', name: 'Naira Wallet', amount: '₦850,000.00', meta: 'Available balance', style: 'wallet-ngn' },
      { id: 'usd', name: 'Dollar Wallet', amount: '$1,280.00', meta: 'Available balance', style: 'wallet-usd' },
      { id: 'btc', name: 'Bitcoin Wallet', amount: '0.0245 BTC', meta: '≈ ₦1,102,500', style: 'wallet-btc' },
      { id: 'eth', name: 'Ethereum Wallet', amount: '1.93 ETH', meta: '≈ ₦8,342,050', style: 'wallet-eth' },
      { id: 'usdt', name: 'USDT Wallet', amount: '4,000 USDT', meta: 'TRC20', style: 'wallet-usdt' }
    ],
    quickActions: ['Add Funds', 'Exchange', 'Send Money', 'Pay Bills', 'Gift Cards', 'Airtime/Data'],
    transactions: [
      { id: 1, title: 'Bank Deposit', subtitle: 'From GTBank • 2:45 PM', amount: '+₦50,000', type: 'positive' },
      { id: 2, title: 'Electricity Bill', subtitle: 'Ikeja Electric • 12:10 PM', amount: '-₦25,000', type: 'negative' },
      { id: 3, title: 'Gift Card Sale', subtitle: 'Amazon USD • Yesterday', amount: '+₦72,500', type: 'positive' }
    ]
  };

  function ScreenTitle(props) {
    return e('header', null, [
      e('h1', { key: 't', className: 'h1' }, props.title),
      props.subtitle ? e('p', { key: 's', className: 'subtitle' }, props.subtitle) : null
    ]);
  }

  function Welcome(props) {
    return e('section', { className: 'screen' }, [
      e('div', { className: 'center', key: 'logo' }, e('div', { className: 'app-logo', 'aria-hidden': 'true' }, '₦₿')),
      e('p', { className: 'tagline center', key: 'tag' }, 'Your gateway to seamless digital finance'),
      e(ScreenTitle, { key: 'title', title: 'Get Started' }),
      e('div', { className: 'stacked-actions', role: 'group', 'aria-label': 'Authentication options', key: 'actions' }, [
        e('button', { className: 'btn btn-primary', type: 'button', onClick: () => props.go(views.PHONE), key: 1 }, '📱 Continue with Phone Number'),
        e('button', { className: 'btn btn-secondary', type: 'button', onClick: () => props.go(views.EMAIL), key: 2 }, '✉️ Continue with Email'),
        e('button', { className: 'btn btn-secondary', type: 'button', key: 3 }, '🟢 Continue with Google'),
        e('button', { className: 'btn btn-secondary', type: 'button', key: 4 }, '🪟 Continue with Microsoft')
      ]),
      e('p', { className: 'auth-footer', key: 'f' }, ['Already have an account? ', e('a', { href: '#', key: 'l' }, 'Login')])
    ]);
  }

  function PhoneSignup(props) {
    const [phone, setPhone] = useState('');
    const valid = /^\d{10}$/.test(phone.replace(/\s/g, ''));
    return e('section', { className: 'screen' }, [
      e(ScreenTitle, { key: 't', title: 'Enter Your Phone Number', subtitle: "We'll send you a verification code" }),
      e('label', { htmlFor: 'country', className: 'label', key: 'l1' }, 'COUNTRY CODE'),
      e('select', { id: 'country', className: 'input', defaultValue: '+234', key: 'c' }, [
        e('option', { key: 'n', value: '+234' }, '+234 (Nigeria)'),
        e('option', { key: 'u', value: '+1' }, '+1 (United States)')
      ]),
      e('label', { htmlFor: 'phone', className: 'label', key: 'l2' }, 'PHONE NUMBER'),
      e('input', {
        id: 'phone',
        className: 'input',
        type: 'tel',
        autoComplete: 'tel',
        placeholder: '801 234 5678',
        value: phone,
        onChange: (ev) => setPhone(ev.target.value),
        key: 'p'
      }),
      e('p', { className: 'helper', key: 'h' }, 'Enter your 10-digit phone number'),
      e('button', {
        className: 'btn btn-primary',
        type: 'button',
        disabled: !valid,
        onClick: () => props.setOtpTarget(`+234 ${phone}`),
        key: 'b'
      }, 'Send OTP')
    ]);
  }

  function OtpVerification(props) {
    const [code, setCode] = useState('');
    const complete = code.length === 6;
    return e('section', { className: 'screen' }, [
      e(ScreenTitle, { key: 't', title: 'Enter Verification Code', subtitle: `Code sent to ${props.phone}` }),
      e('label', { htmlFor: 'otp', className: 'label', key: 'l' }, 'OTP CODE'),
      e('input', {
        id: 'otp',
        className: 'input otp',
        maxLength: 6,
        inputMode: 'numeric',
        placeholder: '123456',
        value: code,
        onChange: (ev) => setCode(ev.target.value.replace(/\D/g, '')),
        key: 'i'
      }),
      e('p', { className: 'timer', key: 'tm' }, '⏰ Valid for 2:45'),
      e('button', { className: 'btn btn-text', type: 'button', key: 'r' }, 'Resend OTP'),
      e('button', { className: 'btn btn-primary', type: 'button', disabled: !complete, onClick: () => props.go(views.PIN_CREATE), key: 'v' }, 'Verify')
    ]);
  }

  function EmailSignup(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const validEmail = /.+@.+\..+/.test(email);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const hasLength = password.length >= 8;
    const score = [hasUpper, hasNumber, hasSpecial, hasLength].filter(Boolean).length;
    const strength = score <= 1 ? 'Weak' : score <= 3 ? 'Medium' : 'Strong';
    const formValid = validEmail && score === 4;

    return e('section', { className: 'screen' }, [
      e(ScreenTitle, { key: 't', title: 'Create Account with Email' }),
      e('label', { htmlFor: 'email', className: 'label', key: 'le' }, 'EMAIL ADDRESS'),
      e('input', { id: 'email', className: 'input', type: 'email', autoComplete: 'email', value: email, onChange: (ev) => setEmail(ev.target.value), placeholder: 'you@example.com', key: 'e' }),
      e('label', { htmlFor: 'password', className: 'label', key: 'lp' }, 'PASSWORD'),
      e('div', { className: 'inline-input', key: 'wrap' }, [
        e('input', { id: 'password', className: 'input', type: show ? 'text' : 'password', autoComplete: 'new-password', value: password, onChange: (ev) => setPassword(ev.target.value), placeholder: 'Create a strong password', key: 'p' }),
        e('button', { className: 'mini-btn', type: 'button', onClick: () => setShow(!show), key: 's' }, show ? 'Hide' : 'Show')
      ]),
      e('div', { className: `strength strength-${strength.toLowerCase()}`, 'aria-live': 'polite', key: 'st' }, `Strength: ${strength}`),
      e('ul', { className: 'checklist', key: 'cl' }, [
        e('li', { key: 1 }, `${hasLength ? '✓' : '○'} At least 8 characters`),
        e('li', { key: 2 }, `${hasUpper ? '✓' : '○'} One uppercase letter`),
        e('li', { key: 3 }, `${hasNumber ? '✓' : '○'} One number`),
        e('li', { key: 4 }, `${hasSpecial ? '✓' : '○'} One special character`)
      ]),
      e('button', { className: 'btn btn-primary', type: 'button', disabled: !formValid, onClick: () => props.go(views.PIN_CREATE), key: 'c' }, 'Create Account')
    ]);
  }

  function PinPad(props) {
    const numbers = ['1','2','3','4','5','6','7','8','9','🔒','0','⌫'];
    return e('div', { className: 'pin-grid' }, numbers.map((n) => e('button', {
      key: n,
      type: 'button',
      className: 'pin-btn',
      onClick: () => props.onPress(n),
      'aria-label': n === '⌫' ? 'Delete' : n === '🔒' ? 'Use biometric' : `Number ${n}`
    }, n)));
  }

  function PinCreate(props) {
    const dots = Array.from({ length: 6 }, (_, i) => i < props.pin.length);
    return e('section', { className: 'screen center' }, [
      e(ScreenTitle, { key: 't', title: 'Secure Your Account', subtitle: 'Create a 6-digit PIN for quick transactions' }),
      e('div', { className: 'dots', key: 'd' }, dots.map((filled, i) => e('span', { key: i, className: `dot ${filled ? 'filled' : ''}` }))),
      e('p', { className: 'helper', key: 'h' }, "Choose a PIN you'll remember"),
      e(PinPad, { key: 'k', onPress: props.onPress })
    ]);
  }

  function PinConfirm(props) {
    const dots = Array.from({ length: 6 }, (_, i) => i < props.confirm.length);
    return e('section', { className: 'screen center' }, [
      e(ScreenTitle, { key: 't', title: 'Confirm Your PIN', subtitle: 'Enter your PIN again to confirm' }),
      props.error ? e('p', { className: 'error', role: 'alert', key: 'er' }, "PINs don't match. Please try again.") : null,
      e('div', { className: 'dots', key: 'd' }, dots.map((filled, i) => e('span', { key: i, className: `dot ${filled ? 'filled' : ''}` }))),
      e(PinPad, { key: 'k', onPress: props.onPress })
    ]);
  }

  function Biometric(props) {
    return e('section', { className: 'screen center' }, [
      e('div', { className: 'bio-icon', key: 'i' }, '🧬'),
      e(ScreenTitle, { key: 't', title: 'Enable Biometric Login', subtitle: 'Use Face ID / Fingerprint for faster and more secure access' }),
      e('ul', { className: 'benefits', key: 'b' }, [
        e('li', { key: 1 }, '✓ Faster login and transactions'),
        e('li', { key: 2 }, '✓ Enhanced security'),
        e('li', { key: 3 }, '✓ No need to remember PIN every time')
      ]),
      e('button', { className: 'btn btn-primary', type: 'button', onClick: () => props.go(views.KYC_INTRO), key: 'p' }, 'Enable Biometric'),
      e('button', { className: 'btn btn-text', type: 'button', onClick: () => props.go(views.KYC_INTRO), key: 's' }, 'Skip for Now')
    ]);
  }

  function KycIntro(props) {
    return e('section', { className: 'screen' }, [
      e('p', { className: 'step-label', key: 's' }, 'Step 1 of 2'),
      e(ScreenTitle, { key: 't', title: 'Verify Your Identity', subtitle: 'Complete KYC to unlock all features' }),
      e('article', { className: 'card', key: 'c1' }, [e('h3', { key: 'h' }, 'Level 1: Basic Profile'), e('p', { key: 'p' }, 'Quick signup - basic info only'), e('p', { key: 'l' }, '₦50,000 daily limit')]),
      e('article', { className: 'card', key: 'c2' }, [e('h3', { key: 'h' }, 'Level 2: Full Verification'), e('p', { key: 'p' }, 'Complete verification for full access'), e('p', { key: 'l' }, 'Unlimited transactions')]),
      e('button', { className: 'btn btn-primary', type: 'button', onClick: () => props.go(views.KYC_L1), key: 'b' }, 'Start Verification'),
      e('button', { className: 'btn btn-text', type: 'button', onClick: () => props.go(views.DASHBOARD), key: 'sk' }, "I'll do this later")
    ]);
  }

  function KycL1(props) {
    const [form, setForm] = useState({ name: '', dob: '', gender: '', address: '' });
    const valid = form.name && form.dob && form.gender && form.address;
    const set = (k, v) => setForm((p) => Object.assign({}, p, { [k]: v }));
    return e('section', { className: 'screen' }, [
      e('p', { className: 'step-label', key: 's' }, 'Step 1 of 2 • Basic Profile'),
      e('label', { htmlFor: 'fn', className: 'label', key: 'l1' }, 'FULL NAME *'),
      e('input', { id: 'fn', className: 'input', value: form.name, onChange: (ev) => set('name', ev.target.value), placeholder: 'As it appears on your ID', key: 'i1' }),
      e('label', { htmlFor: 'dob', className: 'label', key: 'l2' }, 'DATE OF BIRTH *'),
      e('input', { id: 'dob', className: 'input', type: 'date', value: form.dob, onChange: (ev) => set('dob', ev.target.value), key: 'i2' }),
      e('fieldset', { key: 'fs' }, [
        e('legend', { className: 'label', key: 'g' }, 'GENDER *'),
        e('div', { className: 'radio-row', key: 'r' }, ['Male','Female','Other'].map((it) => e('label', { key: it }, [
          e('input', { type: 'radio', name: 'gender', value: it, checked: form.gender === it, onChange: (ev) => set('gender', ev.target.value), key: 'in' }), it
        ])))
      ]),
      e('label', { htmlFor: 'ad', className: 'label', key: 'l3' }, 'RESIDENTIAL ADDRESS *'),
      e('textarea', { id: 'ad', className: 'input', maxLength: 200, value: form.address, onChange: (ev) => set('address', ev.target.value), key: 'ta' }),
      e('div', { className: 'helper', key: 'ct' }, `${form.address.length} / 200 characters`),
      e('div', { className: 'info-box', key: 'ib' }, 'ℹ️ Email and phone are already verified from signup'),
      e('button', { className: 'btn btn-primary', type: 'button', disabled: !valid, onClick: () => props.go(views.KYC_L2), key: 'c' }, 'Continue'),
      e('button', { className: 'btn btn-text', type: 'button', key: 'd' }, 'Save as Draft')
    ]);
  }

  function KycL2(props) {
    const [mode, setMode] = useState('BVN');
    const [idNo, setIdNo] = useState('');
    const [idUploaded, setIdUploaded] = useState(false);
    const [proofUploaded, setProofUploaded] = useState(false);
    const [selfieUploaded, setSelfieUploaded] = useState(false);
    const ready = idNo.length === 11 && idUploaded && proofUploaded && selfieUploaded;
    return e('section', { className: 'screen' }, [
      e('p', { className: 'step-label', key: 's' }, 'Step 2 of 2 • Advanced Verification'),
      e('div', { className: 'warn-box', key: 'w' }, '⚠️ This verification usually takes 2-24 hours.'),
      e('h2', { className: 'h2', key: 'h1' }, 'Government ID Verification'),
      e('div', { className: 'radio-row', key: 'rg' }, ['BVN', 'NIN'].map((n) => e('label', { key: n }, [
        e('input', { type: 'radio', name: 'mode', value: n, checked: mode === n, onChange: (ev) => setMode(ev.target.value), key: 'in' }), ` ${n}`
      ]))),
      e('label', { htmlFor: 'idno', className: 'label', key: 'l' }, `ENTER YOUR ${mode} *`),
      e('input', { id: 'idno', className: 'input', maxLength: 11, inputMode: 'numeric', value: idNo, onChange: (ev) => setIdNo(ev.target.value.replace(/\D/g, '')), placeholder: '12345678901', key: 'i' }),
      e('p', { className: idNo.length === 11 ? 'success' : 'helper', key: 'v' }, idNo.length === 11 ? '✓ Verified: John Doe' : 'Enter 11 digits to verify'),
      e('h2', { className: 'h2', key: 'h2' }, 'Upload Documents'),
      e('button', { className: 'upload', type: 'button', onClick: () => setIdUploaded(!idUploaded), key: 'u1' }, idUploaded ? '✓ Government ID Uploaded' : 'Upload Government ID'),
      e('button', { className: 'upload', type: 'button', onClick: () => setProofUploaded(!proofUploaded), key: 'u2' }, proofUploaded ? '✓ Proof of Address Uploaded' : 'Upload Proof of Address'),
      e('h2', { className: 'h2', key: 'h3' }, 'Live Selfie Verification'),
      e('button', { className: 'upload selfie', type: 'button', onClick: () => setSelfieUploaded(!selfieUploaded), key: 'u3' }, selfieUploaded ? '✓ Selfie Captured' : 'Take Selfie'),
      e('details', { className: 'guidelines', key: 'g' }, [e('summary', { key: 'sm' }, 'Selfie Guidelines'), e('ul', { key: 'ul' }, [e('li', { key: 1 }, 'Remove glasses and hat'), e('li', { key: 2 }, 'Ensure good lighting'), e('li', { key: 3 }, 'Look directly at camera')])]),
      e('button', { className: 'btn btn-primary', type: 'button', disabled: !ready, onClick: () => props.go(views.KYC_STATUS), key: 'sub' }, 'Submit for Review')
    ]);
  }

  function KycStatus(props) {
    const [status, setStatus] = useState('pending');
    const map = {
      pending: { icon: '🕒', title: 'Under Review', text: 'Your documents are being reviewed. This usually takes 2-24 hours.', cls: 'warning' },
      approved: { icon: '✅', title: 'Verified!', text: 'Your account is fully verified. You now have unlimited access!', cls: 'success' },
      rejected: { icon: '❌', title: 'Verification Failed', text: "We couldn't verify your documents. Please try again.", cls: 'error' }
    }[status];
    return e('section', { className: 'screen center' }, [
      e('div', { className: 'status-icon', key: 'i' }, map.icon),
      e('h1', { className: `h1 ${map.cls}`, key: 't' }, map.title),
      e('p', { className: 'subtitle', key: 's' }, map.text),
      status === 'rejected' ? e('div', { className: 'reject-card', key: 'rj' }, 'Reason: The ID photo was unclear. Please upload a clearer image.') : null,
      e('div', { className: 'card', key: 'ac' }, status === 'approved' ? 'Full Access Unlocked: Unlimited transactions + priority support' : 'Current Access: ₦50,000 daily / ₦500,000 monthly'),
      e('div', { className: 'radio-row', key: 'sim' }, ['pending', 'approved', 'rejected'].map((s) => e('button', { className: 'mini-btn', type: 'button', onClick: () => setStatus(s), key: s }, s))),
      e('button', { className: 'btn btn-primary', type: 'button', onClick: () => props.go(status === 'rejected' ? views.KYC_L2 : views.DASHBOARD), key: 'go' }, status === 'rejected' ? 'Try Again' : 'Go to Dashboard')
    ]);
  }

  function Dashboard(props) {
    return e('section', { className: 'screen' }, [
      e('header', { className: 'dash-header', key: 'dh' }, [
        e('button', { className: 'icon-btn', type: 'button', key: 'p', 'aria-label': 'Profile' }, '👤'),
        e('h2', { className: 'h2', key: 'h' }, 'Home Dashboard'),
        e('button', { className: 'icon-btn', type: 'button', key: 'n', 'aria-label': 'Notifications' }, '🔔')
      ]),
      e('article', { className: 'kyc-alert', role: 'alert', key: 'k' }, [
        e('p', { key: 'p' }, 'Complete KYC to unlock all features'),
        e('button', { className: 'btn-link', type: 'button', onClick: () => props.go(views.KYC_INTRO), key: 'b' }, 'Verify Now →')
      ]),
      e('section', { className: 'portfolio', key: 'po' }, [
        e('p', { key: 'l' }, 'Total Portfolio Value'),
        e('h3', { key: 'a' }, '₦2,450,000.00'),
        e('p', { className: 'positive', key: 'c' }, '↑ ₦45,000 (+1.87%)')
      ]),
      e('section', { className: 'wallet-list', key: 'wl', 'aria-label': 'Wallet list' }, mock.wallets.map((wallet) => e('article', { className: `wallet ${wallet.style}`, key: wallet.id }, [
        e('h3', { key: 'h' }, wallet.name),
        e('p', { className: 'amount', key: 'a' }, wallet.amount),
        e('p', { key: 'm' }, wallet.meta)
      ]))),
      e('h3', { className: 'section-title', key: 'qt' }, 'Quick Actions'),
      e('div', { className: 'quick-grid', key: 'qg' }, mock.quickActions.map((item) => e('button', { className: 'quick-action', type: 'button', key: item }, item))),
      e('h3', { className: 'section-title', key: 'rt' }, 'Recent Activity'),
      e('ul', { className: 'transactions', key: 'tx' }, mock.transactions.map((tx) => e('li', { className: 'transaction-item', key: tx.id }, [
        e('div', { key: 'l' }, [e('p', { className: 'tx-title', key: 't' }, tx.title), e('p', { className: 'tx-subtitle', key: 's' }, tx.subtitle)]),
        e('p', { className: `tx-amount ${tx.type}`, key: 'a' }, tx.amount)
      ])))
    ]);
  }

  function App() {
    const [view, setView] = useState(views.WELCOME);
    const [otpPhone, setOtpPhone] = useState('+234 801 234 5678');
    const [pin, setPin] = useState('');
    const [confirm, setConfirm] = useState('');
    const [pinError, setPinError] = useState(false);

    function handlePinInput(symbol) {
      if (symbol === '🔒') return setView(views.BIOMETRIC);
      if (view === views.PIN_CREATE) {
        if (symbol === '⌫') return setPin((p) => p.slice(0, -1));
        if (/\d/.test(symbol) && pin.length < 6) {
          const next = pin + symbol;
          setPin(next);
          if (next.length === 6) setTimeout(() => setView(views.PIN_CONFIRM), 200);
        }
      } else if (view === views.PIN_CONFIRM) {
        if (symbol === '⌫') return setConfirm((p) => p.slice(0, -1));
        if (/\d/.test(symbol) && confirm.length < 6) {
          const next = confirm + symbol;
          setConfirm(next);
          if (next.length === 6) {
            const matched = next === pin;
            setPinError(!matched);
            setTimeout(() => {
              if (matched) setView(views.BIOMETRIC);
              else setConfirm('');
            }, 350);
          }
        }
      }
    }

    function setOtpTarget(number) {
      setOtpPhone(number || otpPhone);
      setView(views.OTP);
    }

    return e(React.Fragment, null, [
      e('a', { className: 'skip-link', href: '#main-content', key: 's' }, 'Skip to content'),
      e('main', { id: 'main-content', className: 'app', key: 'm' }, [
        view === views.WELCOME ? e(Welcome, { go: setView, key: 'w' }) : null,
        view === views.PHONE ? e(PhoneSignup, { setOtpTarget, key: 'ph' }) : null,
        view === views.OTP ? e(OtpVerification, { phone: otpPhone, go: setView, key: 'o' }) : null,
        view === views.EMAIL ? e(EmailSignup, { go: setView, key: 'e' }) : null,
        view === views.PIN_CREATE ? e(PinCreate, { pin, onPress: handlePinInput, key: 'pc' }) : null,
        view === views.PIN_CONFIRM ? e(PinConfirm, { confirm, error: pinError, onPress: handlePinInput, key: 'pf' }) : null,
        view === views.BIOMETRIC ? e(Biometric, { go: setView, key: 'bio' }) : null,
        view === views.KYC_INTRO ? e(KycIntro, { go: setView, key: 'ki' }) : null,
        view === views.KYC_L1 ? e(KycL1, { go: setView, key: 'k1' }) : null,
        view === views.KYC_L2 ? e(KycL2, { go: setView, key: 'k2' }) : null,
        view === views.KYC_STATUS ? e(KycStatus, { go: setView, key: 'ks' }) : null,
        view === views.DASHBOARD ? e(Dashboard, { go: setView, key: 'd' }) : null
      ]),
      e('nav', { className: 'bottom-nav', 'aria-label': 'Primary navigation', key: 'n' }, [
        e('button', { className: `tab ${view === views.WELCOME ? 'active' : ''}`, type: 'button', onClick: () => setView(views.WELCOME), key: 't1' }, 'Welcome'),
        e('button', { className: `tab ${[views.KYC_INTRO, views.KYC_L1, views.KYC_L2, views.KYC_STATUS].includes(view) ? 'active' : ''}`, type: 'button', onClick: () => setView(views.KYC_INTRO), key: 't2' }, 'KYC'),
        e('button', { className: `tab ${view === views.DASHBOARD ? 'active' : ''}`, type: 'button', onClick: () => setView(views.DASHBOARD), key: 't3' }, 'Home')
      ]),
      e('button', { className: 'fab', type: 'button', 'aria-label': 'Quick Exchange', key: 'f', onClick: () => setView(views.DASHBOARD) }, '⇄')
    ]);
  }

  ReactDOM.createRoot(document.getElementById('root')).render(e(App));
})();
