"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

const Page = () => {
  const [fromChain, setFromChain] = useState("");
  const [toChain, setToChain] = useState("");
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [commission, setCommission] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      const commissionValue = (parseFloat(amount) * 0.005).toFixed(6);
      setCommission(commissionValue);
      setFinalAmount(
        (parseFloat(amount) - parseFloat(commissionValue)).toFixed(6)
      );
    } else {
      setCommission("");
      setFinalAmount("");
    }
  }, [amount]);

  // Função para obter o saldo do token (ERC-20)
  const getTokenBalance = async (tokenAddress, userAddress) => {
    const tokenABI = [
      "function balanceOf(address owner) view returns (uint256)",
    ];
    const provider = new ethers.BrowserProvider(window.ethereum);
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
    const balance = await tokenContract.balanceOf(userAddress);
    return ethers.utils.formatUnits(balance, 18); // Ajuste os decimais conforme necessário
  };

  // Função para realizar a transferência
  const handleTransfer = async () => {
    if (!fromChain || !toChain || !token || !amount) {
      setMessage("Preencha todos os campos antes de continuar.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (!window.ethereum) {
        setMessage("MetaMask não está disponível.");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      let tokenAddress;
      if (token === "eth") {
        tokenAddress = null; // Ethereum nativo não precisa de endereço de contrato
      } else if (token === "usdt") {
        tokenAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7"; // USDT no Ethereum
      } else if (token === "usdc") {
        tokenAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // USDC no Ethereum
      }
      // Adicione outros tokens conforme necessário

      let balance;
      if (tokenAddress) {
        balance = await getTokenBalance(tokenAddress, userAddress);
      } else {
        balance = await provider.getBalance(userAddress); // Para ETH
      }

      if (parseFloat(balance) < parseFloat(amount)) {
        setMessage("Saldo insuficiente.");
        setLoading(false);
        return;
      }

      let tx;
      if (token === "eth") {
        // Transferência de ETH
        tx = await signer.sendTransaction({
          to: "0x1234567890abcdef1234567890abcdef12345678", // Substitua pelo endereço real de destino
          value: ethers.parseEther(amount), // Use o valor da transferência em ETH
        });
      } else {
        // Transferência de token ERC-20 (ex: USDT)
        const tokenContract = new ethers.Contract(
          tokenAddress,
          [
            "function transfer(address to, uint256 amount) public returns (bool)",
          ],
          signer
        );
        tx = await tokenContract.transfer(
          "0x1234567890abcdef1234567890abcdef12345678", // Substitua pelo endereço real de destino
          ethers.parseUnits(amount, 6) // Ajuste os decimais (6 para USDT, por exemplo)
        );
      }

      await tx.wait();

      setMessage(
        `Transferência realizada com sucesso!\n\nValor enviado: ${finalAmount} ${token.toUpperCase()}\nComissão: ${commission} ETH`
      );
    } catch (error) {
      console.error("Erro durante a transferência:", error);
      setMessage("Erro ao processar a transferência.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">VaultBridge</h1>

      <label>Rede de origem:</label>
      <select
        value={fromChain}
        onChange={(e) => setFromChain(e.target.value)}
        className="block w-full mb-4"
      >
        <option value="">Selecione</option>
        <option value="ethereum">Ethereum</option>
        <option value="arbitrum">Arbitrum</option>
      </select>

      <label>Rede de destino:</label>
      <select
        value={toChain}
        onChange={(e) => setToChain(e.target.value)}
        className="block w-full mb-4"
      >
        <option value="">Selecione</option>
        <option value="ethereum">Ethereum</option>
        <option value="arbitrum">Arbitrum</option>
      </select>

      <label>Token:</label>
      <select
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="block w-full mb-4"
      >
        <option value="">Selecione</option>
        <option value="eth">ETH</option>
        <option value="usdt">USDT</option>
        <option value="usdc">USDC</option>
        {/* Adicione outros tokens conforme necessário */}
      </select>

      <label>Quantidade:</label>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="block w-full mb-4 border p-2"
      />

      {commission && (
        <div className="mb-4">
          <p>Comissão (0.5%): {commission} ETH</p>
          <p>
            Valor a receber: {finalAmount} {token.toUpperCase()}
          </p>
        </div>
      )}

      <button
        onClick={handleTransfer}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Processando..." : "Transferir"}
      </button>

      {message && (
        <p className="mt-4 text-sm text-gray-800 whitespace-pre-line">
          {message}
        </p>
      )}
    </div>
  );
};

export default Page;
