import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, LogIn, Activity, AlertTriangle, User } from 'lucide-react';

const Login = ({ setSession }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      let msg = error.message.toUpperCase();
      if (msg.includes('EMAIL NOT CONFIRMED')) msg = 'EMAIL VERIFICATION PENDING. CHECK YOUR INBOX.';
      setMessage({ type:'error', text:msg });
    } else navigate('/');
    setLoading(false);
  };

  const handleGuestLogin = () => {
    const guestSession = {
      user: { id: 'guest', email: 'guest@netchronaix.local' },
      isGuest: true
    };
    localStorage.setItem('netchronaix_guest_session', JSON.stringify(guestSession));
    setSession(guestSession);
    navigate('/');
  };

  return (
    <div className="flex-center" style={{minHeight:'80vh'}}>
      <div className="glass-panel auth-panel" style={{width:'100%',maxWidth:460}}>
        <div className="tech-corner tc-tl"></div><div className="tech-corner tc-tr"></div>
        <div className="tech-corner tc-bl"></div><div className="tech-corner tc-br"></div>
        <div className="flex-col-center" style={{gap:28,textAlign:'center'}}>
          <Activity className="neon-text-cyan" size={36}/>
          <div>
            <h2 style={{fontFamily:'var(--font-header)',fontSize:'1.5rem',color:'var(--neon-cyan)',textShadow:'0 0 12px rgba(var(--neon-cyan-rgb),0.4)',marginBottom:6}}>ACCESS TERMINAL</h2>
            <p className="font-mono" style={{fontSize:10,color:'var(--text-muted)',letterSpacing:3}}>AUTHENTICATION REQUIRED</p>
          </div>
          <form onSubmit={handleLogin} style={{width:'100%',display:'flex',flexDirection:'column',gap:16}}>
            <div>
              <label className="label-tech">Email</label>
              <div style={{position:'relative'}}>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-field" placeholder="you@domain.com" required/>
                <Mail size={16} style={{position:'absolute',right:14,top:16,color:'var(--text-muted)'}}/>
              </div>
            </div>
            <div>
              <label className="label-tech">Password</label>
              <div style={{position:'relative'}}>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input-field" placeholder="••••••••••" required/>
                <Lock size={16} style={{position:'absolute',right:14,top:16,color:'var(--text-muted)'}}/>
              </div>
            </div>
            {message && <div style={{padding:12,border:'1px solid rgba(239,68,68,0.4)',background:'rgba(239,68,68,0.08)',borderRadius:4,display:'flex',alignItems:'center',gap:10,color:'#ef4444'}}><AlertTriangle size={14}/><span className="font-mono" style={{fontSize:10}}>{message.text}</span></div>}
            <button type="submit" disabled={loading} className="btn-primary" style={{width:'100%'}}>
              {loading?<div className="spin" style={{width:22,height:22,border:'2px solid currentColor',borderTopColor:'transparent',borderRadius:'50%'}}></div>:<><LogIn size={18}/><span>LOGIN</span></>}
            </button>
            <button type="button" onClick={handleGuestLogin} className="btn-secondary" style={{width:'100%', marginTop: 4, display:'flex', alignItems:'center', justifyContent:'center', gap: 8}}>
              <User size={18}/>
              <span>GUEST LOGIN</span>
            </button>
          </form>
          <div style={{borderTop:'1px solid var(--glass-border)',paddingTop:20,width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{color:'var(--text-muted)',fontSize:12}}>New operator?</span>
            <Link to="/register" className="neon-text-purple font-orbitron" style={{fontSize:11,fontWeight:700,textDecoration:'none',letterSpacing:2}}>REGISTER →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
