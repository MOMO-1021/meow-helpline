"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const role = "helper";
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (res?.error) {
        setError("Invalid credentials");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } else {
      // Sign-up
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, role }),
        });

        if (res.ok) {
          // Auto-login after sign-up
          await signIn("credentials", {
            redirect: false,
            username,
            password,
          });
          router.push("/dashboard");
        } else {
          const data = await res.json();
          setError(data.message || "Failed to sign up");
          setIsLoading(false);
        }
      } catch (err) {
        setError("Network error. Please try again.");
        setIsLoading(false);
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", fontFamily: "sans-serif", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>{isLogin ? "Login" : "Sign Up"} to Meow Helpline</h1>
      
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15, marginTop: 20 }}>
        <input 
          type="text" 
          placeholder="Username or Phone Number" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
          style={{ padding: 10, fontSize: 16 }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          style={{ padding: 10, fontSize: 16 }}
        />

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: 12, 
            fontSize: 16, 
            backgroundColor: isLoading ? "#999" : "#0070f3", 
            color: "white", 
            border: "none", 
            borderRadius: 4, 
            cursor: isLoading ? "not-allowed" : "pointer" 
          }}
        >
          {isLoading ? "Please wait..." : (isLogin ? "Login" : "Sign Up")}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 20, cursor: "pointer", color: "#0070f3" }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
      </p>
    </div>
  );
}
