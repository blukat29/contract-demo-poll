import { ReactElement, useState } from "react";
import { Button, Col, Form, Image, Row, Spinner, Stack } from "react-bootstrap";
import { BigNumber, ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";

import pollAbi from "../abi/poll.json";
import catPng from "../assets/cat.png";
import dogPng from "../assets/dog.png";

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
          <Stack gap={2}>
            <Stack gap={1} className="align-items-center">
              <Image src={catPng} style={{ width: 200, height: 200 }} />
              <Button
                variant="primary"
                style={{ width: "100%" }}
                disabled={pendingTx}
                onClick={(): void => {
                  onClickVote({ isCat: true });
                }}
              >
                Vote
              </Button>
            </Stack>
            <Form.Text style={{ fontSize: 24 }}>
              <b>Cat :</b> {data?.cats.toString()}
            </Form.Text>
          </Stack>
        </Col>
        <Col className="col-1" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Form.Text style={{ fontSize: 20, fontWeight: "bold" }}>VS</Form.Text>
        </Col>
        <Col>
          <Stack gap={2}>
            <Stack gap={1} className="align-items-center">
              <Image src={dogPng} style={{ width: 200, height: 200 }} />
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
            </Stack>
            <Form.Text style={{ fontSize: 24 }}>
              <b>Dog : </b> {data?.doges.toString()}
            </Form.Text>
          </Stack>
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
