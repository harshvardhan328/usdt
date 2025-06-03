async function sendUSDT() {
  console.log('Send button clicked');

  const recipient = document.getElementById('recipient').value;
  const amount = document.getElementById('amount').value;
  console.log('Recipient:', recipient);
  console.log('Amount:', amount);

  if (!recipient || !amount) {
    alert('Enter recipient address and amount');
    return;
  }

  if (!window.ethereum) {
    alert('MetaMask not detected');
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const network = await provider.getNetwork();
  console.log('Network:', network);
  if (network.chainId !== 5) {
    alert('Please switch MetaMask to Goerli testnet');
    return;
  }

  const usdtAddress = "0x509Ee0d083DdF8AC028f2a56731412edD63223B9";
  const erc20Abi = [
    "function transfer(address to, uint amount) returns (bool)",
    "function decimals() view returns (uint8)"
  ];

  const usdtContract = new ethers.Contract(usdtAddress, erc20Abi, signer);

  const decimals = await usdtContract.decimals();
  const amountInUnits = ethers.utils.parseUnits(amount.toString(), decimals);

  try {
    console.log('Sending transaction...');
    const tx = await usdtContract.transfer(recipient, amountInUnits);
    console.log('Transaction sent:', tx.hash);
    alert('Transaction sent: ' + tx.hash);
    await tx.wait();
    alert('Transaction confirmed!');
  } catch (error) {
    console.error('Transfer failed:', error);
    alert('Transfer failed: ' + (error.data?.message || error.message));
  }
}
