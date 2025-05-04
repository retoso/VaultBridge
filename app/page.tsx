"use client";

import { Button } from "../app/components/ui/button";
import { Card, CardContent } from "../app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../app/components/ui/select";
import { useEffect, useState } from "react";
import { WalletIcon, Send } from "lucide-react";
import { motion } from "framer-motion";
import { ethers } from "ethers";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [fromChain, setFromChain] = useState("");
  const [toChain, setToChain] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setConnected(true);
      } catch (error) {
        console.error("Erro ao conectar carteira:", error);
      }
    } else {
      alert("MetaMask não encontrada. Instale para continuar.");
    }
  };

  const handleTransfer = async () => {
    if (!fromChain || !toChain || !token) {
      setMessage("Preencha todos os campos antes de continuar.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      setTimeout(() => {
        setMessage(
          "Transferência simulada com sucesso (a integração real será ativada em breve)."
        );
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Erro durante a transferência:", error);
      setMessage("Falha na tentativa de transferência.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
      setConnected(true);
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900 text-white p-6">
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold mb-4 text-center tracking-tight"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        VaultBridge
      </motion.h1>
      <p className="text-lg md:text-xl text-center max-w-2xl mb-8 text-gray-300">
        Conecte suas carteiras e transfira tokens entre blockchains com
        segurança e facilidade.
      </p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6 w-full max-w-md"
      >
        <Card className="bg-white text-[#003366] rounded-2xl shadow-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Carteira</h2>
            {connected ? (
              <p className="text-green-700 font-medium">Conectado: {account}</p>
            ) : (
              <Button
                onClick={connectWallet}
                className="w-full bg-[#C0C0C0] text-[#003366] hover:bg-gray-300"
              >
                <WalletIcon className="mr-2" /> Conectar Carteira
              </Button>
            )}
          </CardContent>
        </Card>

        {connected && (
          <Card className="bg-white text-[#003366] rounded-2xl shadow-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Transferência</h2>
              <div>
                <label className="block text-sm font-medium mb-1">
                  De (rede origem)
                </label>
                <Select onValueChange={setFromChain}>
                  <SelectTrigger className="w-full bg-gray-100">
                    <SelectValue placeholder="Selecione a rede de origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="optimism">Optimism</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Para (rede destino)
                </label>
                <Select onValueChange={setToChain}>
                  <SelectTrigger className="w-full bg-gray-100">
                    <SelectValue placeholder="Selecione a rede de destino" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="optimism">Optimism</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Token</label>
                <Select onValueChange={setToken}>
                  <SelectTrigger className="w-full bg-gray-100">
                    <SelectValue placeholder="Selecione o token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth">ETH</SelectItem>
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="wbtc">WBTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full bg-[#003366] text-white hover:bg-[#002244]"
                onClick={handleTransfer}
                disabled={loading}
              >
                {loading ? (
                  "Transferindo..."
                ) : (
                  <>
                    <Send className="mr-2" /> Iniciar Transferência
                  </>
                )}
              </Button>
              {message && (
                <p className="text-sm mt-2 text-center text-[#003366] font-medium">
                  {message}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
      <footer className="mt-10 text-sm text-gray-400 text-center">
        © 2025 VaultBridge. Todos os direitos reservados.
      </footer>
    </main>
  );
}
