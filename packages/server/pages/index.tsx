import { NextPage } from "next";
import dynamic from "next/dynamic";
import { SuperchargedTxButton } from '../components/SuperchargedTxButton'

const ReactUIWalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);


const Home: NextPage = () => {
  return <div><ReactUIWalletMultiButtonDynamic /><SuperchargedTxButton /></div>
};

export default Home;
