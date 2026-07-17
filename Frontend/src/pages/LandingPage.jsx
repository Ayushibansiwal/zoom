import React, { useContext,useState } from "react";
import { Link } from "react-router-dom";
import { User, Lock, Mail, Video, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../validations/authSchema";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function LandingPage() {
  const { handleSignUp } = useContext(AuthContext);
  const [msg,setMsg] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting},
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",      
  });

  const onSubmit = async (data) => {
    try {
      const response = await handleSignUp(
        data.username,
        data.email,
        data.password
      );
      setMsg(response.message);

      navigate("/dashboard");

    }catch (error) {
    setMsg(
        error.response?.data?.message ||
        "Something went wrong"
    );
  }
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
            CAPTURE THE MESH /{" "}
            <span className="hud-glow-green">UNLOCK WORLD</span>
          </h1>
        </header>

        <main className="hud-center-console">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="hud-quadrant-form"
          >
            {/* Username */}
            <div className="hud-quad-box q-one">
              <div className="quad-label">01 // TARGET_ID</div>

              <div className="quad-input-wrap">
                <User className="quad-icon" />

                <input
                  type="text"
                  placeholder="identity_signature"
                  className="quad-field"
                  {...register("username")}
                />
              </div>

              {errors.username && (
                <p className="error">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="hud-quad-box q-two">
              <div className="quad-label">02 // NET_NODE</div>

              <div className="quad-input-wrap">
                <Mail className="quad-icon" />

                <input
                  type="email"
                  placeholder="comms@sub.mesh"
                  className="quad-field"
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <p className="error">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="hud-quad-box q-three">
              <div className="quad-label">03 // SECURE_KEY</div>

              <div className="quad-input-wrap">
                <Lock className="quad-icon" />

                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="quad-field"
                  {...register("password")}
                />
              </div>

              {errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="hud-quad-box q-four">
              <button 
                type="submit" 
                className="quad-submit-btn"
                disabled={isSubmitting}>
                <span>
                  {isSubmitting ? "CONNECTING..." : "INITIALIZE_BEAM"}
                </span>
                <ArrowRight className="quad-arrow-icon" />
              </button>
            </div>
          </form>
        </main>

        {msg && (
          <p className="error">{msg}</p>
        )}

        <footer className="hud-footer-block">
          <div className="hud-link-frame">
            <Link to="/signin" className="hud-bypass-link">
              BYPASS_NEW_LINK (SIGN_IN)
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
  }