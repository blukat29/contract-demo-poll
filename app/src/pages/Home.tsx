import { ReactElement, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { BigNumber, ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";

import pollAbi from "../abi/poll.json";
import { User } from "../type/common";

//// TODO : change contract address
// const VOTE_CONTRACT = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // local
const VOTE_CONTRACT = "0x6517968e4fcc3a5d3e3369f51c62991d0143cd2f"; // baobab

const Home = ({ user }: { user: User }): ReactElement => {
  const contract = new ethers.Contract(VOTE_CONTRACT, pollAbi, user.provider);

  const [txHash, setTxHash] = useState("");
  const [pendingTx, setPendingTx] = useState(false);

  const { data, refetch } = useQuery(["votes"], async () => {
    const cats = (await contract.catVotes()) as BigNumber;
    const doges = (await contract.dogVotes()) as BigNumber;

    return {
      cats,
      doges,
    };
  });

  const _sendTx = async ({ data }: { data: string }): Promise<void> => {
    const txRes = await user.signer.sendTransaction({
      from: user.address,
      to: VOTE_CONTRACT,
      data,
    });
    const txHash = txRes.hash;
    setTxHash(txHash);

    setPendingTx(true);
    txRes
      .wait()
      .then((): void => {
        refetch();
        setTimeout(() => {
          window.alert(
            `Tx completed ! TxHash : ${txHash.substring(0, 6)}...${txHash.substring(txHash.length - 6, txHash.length)}`,
          );
        }, 500);
      })
      .finally(() => {
        setPendingTx(false);
      });
  };

  const onClickVote = async ({ isCat }: { isCat: boolean }): Promise<void> => {
    const data = contract.interface.encodeFunctionData(isCat ? "voteCat" : "voteDog");
    _sendTx({ data });
  };

  const onClickReset = async (): Promise<void> => {
    const data = contract.interface.encodeFunctionData("reset");
    _sendTx({ data });
  };

  return (
    <div>
      <Row>
        <Col>
          <b>Cat :</b> {data?.cats.toString()}
        </Col>
      </Row>
      <Row>
        <Col>
          <b>Dog : </b> {data?.doges.toString()}
        </Col>
      </Row>

      <hr />
      <Row>
        <Col>
          <b>Vote</b>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            variant="primary"
            style={{ width: "100%" }}
            disabled={pendingTx}
            onClick={(): void => {
              onClickVote({ isCat: true });
            }}
          >
            Cat
          </Button>
        </Col>
        <Col>
          <Button
            variant="success"
            style={{ width: "100%" }}
            disabled={pendingTx}
            onClick={(): void => {
              onClickVote({ isCat: false });
            }}
          >
            Dog
          </Button>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <Button variant="danger" disabled={pendingTx} style={{ width: "100%" }} onClick={onClickReset}>
            Reset
          </Button>
        </Col>
      </Row>
      {txHash && (
        <>
          <hr />
          <Row>
            <Col>
              <b>{pendingTx && <Spinner size="sm" />} TX Hash :</b> <br />
              {txHash}
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Home;
