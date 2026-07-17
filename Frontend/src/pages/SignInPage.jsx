import React, {useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, Video, ArrowRight, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import "../App.css";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from "../validations/authSchema";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const { handleLogin } = useContext(AuthContext);
  const [msg,setMsg] = useState(null);
  const navigate = useNavigate();

  const{
    register,
    handleSubmit,
    formState: {errors,isSubmitting},
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode:"onChange"
  })

  const onSubmit = async (data)=>{
    try {
      const response = await handleLogin(
        data.username,
        data.password
      );
      setMsg(response.message);
      navigate("/dashboard");


    } catch (error) {
      console.log(error);
       setMsg(
    error.response?.data?.message ||
    "Something went wrong"
);
    }
  }

  const handleGuestJoin = () => {
    console.log('Bypassing authorization protocols: Guest access initiated.');
  };

  return (
    <div className="hud-viewport">
      <div className="hud-crosshair horizontal-axis" />
      <div className="hud-crosshair vertical-axis" />
      
      <div className="radar-circle circle-outer">
        <div className="radar-sweep" />
      </div>
      <div className="radar-circle circle-mid" />
      <div className="radar-circle circle-inner" />

      <div className="hud-interface-wrapper">
        <header className="hud-header-block">
          <div className="hud-brand">
            <Video className="hud-brand-icon" />
            <span>VIBEROOM</span>
          </div>
          <h1 className="hud-main-heading">
            SECURE ACCESS / <span className="hud-glow-green">VERIFY UPLINK</span>
          </h1>
        </header>

        <main className="hud-center-console">
          <form onSubmit={handleSubmit(onSubmit)} className="hud-quadrant-form standard-signin-grid">
            
            {/* Quadrant 1: Network Node */}
            <div className="hud-quad-box q-one">
              <div className="quad-label">01 // TARGET_ID</div>
              <div className="quad-input-wrap">
                <Mail className="quad-icon" />
                <input
                  type="text"
                  placeholder="identity_signature"
                  className="quad-field"
                  {...register("username")}
                />
                {errors.username && (
                <p className="error">{errors.username.message}</p>
              )}
              </div>
            </div>

            {/* Quadrant 2: Security Key */}
            <div className="hud-quad-box q-two">
              <div className="quad-label">02 // SECURE_KEY</div>
              <div className="quad-input-wrap">
                <Lock className="quad-icon" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="quad-field"
                  {...register("password")}
                />
                {errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
              </div>
            </div>

            {/* Quadrant 3: Authorization Button */}
            <div className="hud-quad-box q-three">
              <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="quad-submit-btn">
                 {isSubmitting ? "CONNECTING..." : "ESTABLISH_LINK"}
                <ArrowRight className="quad-arrow-icon" />
              </button>
            </div>

            {/* Quadrant 4: Guest Bypass Terminal */}
            <div className="hud-quad-box q-four">
              <button 
                type="button" 
                onClick={handleGuestJoin} 
                className="quad-submit-btn guest-btn"
                style={{ borderColor: 'var(--hud-orange, #ff5500)', color: 'var(--hud-orange, #ff5500)' }}
              >
                <span>JOIN_AS_GUEST</span>
                <ShieldAlert className="quad-arrow-icon" />
              </button>
            </div>
          </form>
        </main>
        {msg && (
              <p className="success-message">
                  {msg}
              </p>
          )
        }
        {/* BOTTOM BLOCK: Action Footprints */}
        <footer className="hud-footer-block">
          <div className="hud-link-frame">
            <Link to="/" className="hud-bypass-link">REGISTER_NEW_NODE (SIGN_UP)</Link>
          </div>
        </footer>

      </div>
    </div>
  );
}