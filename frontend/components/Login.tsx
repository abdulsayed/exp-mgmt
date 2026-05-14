import React, { useState, useEffect } from 'react';
import { Database, Lock, User, AlertCircle, ArrowRight, Info, ShieldCheck, Globe, Key } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loginMethod, setLoginMethod] = useState<'sso' | 'ldap'>('sso');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ssoProvider, setSsoProvider] = useState<string | null>(null);

  // Simulate handling an OAuth/SAML callback if there was a code in the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code') || urlParams.has('id_token')) {
      setIsLoading(true);
      setSsoProvider('Processing SSO Callback...');
      setTimeout(() => {
        // Clean up URL and login
        window.history.replaceState({}, document.title, window.location.pathname);
        onLogin();
      }, 1500);
    }
  }, [onLogin]);

  const handleLdapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // In a real app, this would be:
    // await fetch('/api/auth/ldap', { method: 'POST', body: JSON.stringify({ username, password }) })
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin();
      } else {
        setError('Invalid directory credentials. Please use admin / admin.');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleSsoLogin = (provider: string) => {
    setIsLoading(true);
    setSsoProvider(`Redirecting to ${provider}...`);
    
    // In a real app, you would redirect to your backend to initiate the OAuth/SAML flow:
    // window.location.href = `/api/auth/login/${provider.toLowerCase()}`;
    
    // For this demo, we simulate the redirect and immediate return
    setTimeout(() => {
      // Simulating the redirect back from the IdP with a code
      window.history.replaceState({}, document.title, window.location.pathname + '?code=mock_auth_code_123');
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
            <Database className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Expense Schema Explorer</h1>
          <p className="text-gray-500 text-sm mt-2">Enterprise Authentication</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Method Toggle */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => { setLoginMethod('sso'); setError(''); }}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                loginMethod === 'sso' 
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Single Sign-On
            </button>
            <button
              onClick={() => { setLoginMethod('ldap'); setError(''); }}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                loginMethod === 'ldap' 
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <Key className="w-4 h-4" />
              Directory Login
            </button>
          </div>

          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* SSO View */}
            {loginMethod === 'sso' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {isLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center space-y-4">
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-sm text-gray-400 animate-pulse">{ssoProvider}</p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleSsoLogin('Okta')}
                      className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-gray-100 py-3 px-4 rounded-xl text-sm font-medium transition-all border border-gray-700 hover:border-gray-600"
                    >
                      <Globe className="w-5 h-5 text-blue-400" />
                      Continue with Okta
                    </button>
                    <button
                      onClick={() => handleSsoLogin('Azure AD')}
                      className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-gray-100 py-3 px-4 rounded-xl text-sm font-medium transition-all border border-gray-700 hover:border-gray-600"
                    >
                      <ShieldCheck className="w-5 h-5 text-blue-400" />
                      Continue with Azure AD
                    </button>
                    
                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-gray-900 px-2 text-gray-500">Enterprise SAML / OIDC</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* LDAP / Active Directory View */}
            {loginMethod === 'ldap' && (
              <form onSubmit={handleLdapSubmit} className="space-y-5 animate-in fade-in duration-300">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Corporate Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-xl leading-5 bg-gray-950 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm disabled:opacity-50"
                      placeholder="DOMAIN\username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-xl leading-5 bg-gray-950 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm disabled:opacity-50"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In via LDAP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          
          {/* Hint Footer */}
          <div className="bg-gray-850 px-8 py-4 border-t border-gray-800 flex flex-col gap-2">
            <p className="text-xs text-gray-500 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                <strong>Architecture Note:</strong> Frontend apps cannot connect directly to LDAP. 
                LDAP requires a backend API to bind and verify credentials. SSO uses OAuth2/SAML redirects.
              </span>
            </p>
            {loginMethod === 'ldap' && (
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-2 justify-center">
                Demo LDAP: <span className="font-mono text-gray-400 bg-gray-950 px-1.5 py-0.5 rounded">admin</span> / <span className="font-mono text-gray-400 bg-gray-950 px-1.5 py-0.5 rounded">admin</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
