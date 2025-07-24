"use client";
import Login from "@/components/Login";
import { Suspense, useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // console.log("Decoded data ", decodedData);

  return (
    <Suspense fallback={<p> Loading the data </p>}>
      <Login
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
    </Suspense>
  );
};

export default LoginPage;