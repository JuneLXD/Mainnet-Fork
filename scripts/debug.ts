// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");
import hre from "hardhat";
import { NFTFI_ABI } from "./abis/NFTFI_ABI";
import { WETH_ABI } from "./abis/WETH_ABI";


async function main(): Promise<void> {
    const ethers = hre.ethers;

    const NFTFI_CONTRACT = "0x8252df1d8b29057d1afe3062bf5a64d503152bc8";
    const WETH_CONTRACT = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    const richie_rich_address = "0x999E77c988C4C1451d3B1c104a6cca7813A9946E";
    const LJ_address = "0xac0a76be83fe580d61f176753fe1ddc727fad04f";

    const LJimpersonatedSigner = await ethers.getImpersonatedSigner(LJ_address);
    const richie_rich_impersonatedSigner = await ethers.getImpersonatedSigner(richie_rich_address);

    const WETH_contract = new ethers.Contract(WETH_CONTRACT, WETH_ABI, richie_rich_impersonatedSigner);


    const tx = await WETH_contract.deposit({ value: ethers.utils.parseEther("10") });
    await tx.wait();
    console.log("success");

    const tx2 = await WETH_contract.transfer(LJ_address, ethers.utils.parseEther("10"));
    await tx2.wait();
    console.log("success");

    const loanId = 25366;
    // console.log(typeof(NFTFI_ABI.NFTFI_ABI))

    let balance = await WETH_contract.balanceOf(LJ_address);
    console.log(ethers.utils.formatEther(balance));

    const WETH2_contract = new ethers.Contract(WETH_CONTRACT, WETH_ABI, LJimpersonatedSigner);

    const tx3 = await WETH2_contract.approve(NFTFI_CONTRACT, ethers.utils.parseEther("10"));
    await tx3.wait();
    console.log("success");

    const tx4 = await WETH2_contract.withdraw(ethers.utils.parseEther("5"));
    await tx4.wait();
    console.log("success");

    let WETH_balance = await WETH2_contract.balanceOf(LJ_address);
    console.log(ethers.utils.formatEther(WETH_balance));

    let ETH_balance = await LJimpersonatedSigner.getBalance();
    console.log(ethers.utils.formatEther(ETH_balance));

    const NFTFI_contract = new ethers.Contract(NFTFI_CONTRACT, NFTFI_ABI, LJimpersonatedSigner);


    const gas = await NFTFI_contract.estimateGas.payBackLoan(loanId);
    console.log(ethers.utils.formatEther(gas))

    const tx5 = await NFTFI_contract.callStatic.payBackLoan(loanId);
    console.log(tx5);

    const tx6 = await NFTFI_contract.populateTransaction.payBackLoan(loanId);
    console.log(tx6);

    // const tx5 = await NFTFI_contract.payBackLoan(loanId);
    // await tx5.wait();

    // WETH_balance = await WETH2_contract.balanceOf(LJ_address);
    // console.log(ethers.utils.formatEther(WETH_balance));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
