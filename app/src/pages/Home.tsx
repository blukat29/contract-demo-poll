import { ReactElement, useState } from "react";
import { Button, Col, Form, Image, Row, Stack } from "react-bootstrap";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";

import pollAbi from "../abi/poll.json";
import catPng from "../assets/cat.png";
import dogPng from "../assets/dog.png";
import { User } from "../type/common";

const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT;
const POLL_CONTRACT = import.meta.env.VITE_POLL_CONTRACT;

const Home = ({ user }: { user?: User }): ReactElement => {
  const [pendingTx, setPendingTx] = useState(false);

  const fetchVotes = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
    const contract = new ethers.Contract(POLL_CONTRACT, pollAbi, provider);
    return {
      cats: await contract.catVotes(),
      dogs: await contract.dogVotes(),
      owner: await contract.owner(),
    };
  };
  const { data, refetch } = useQuery(["votes"], fetchVotes, {
    refetchOnWindowFocus: false,
  });

  const sendTx = async ({ func, args = [] }: { func: string; args?: any[] }): Promise<void> => {
    if (!user) {
      alert("Connect wallet first");
      return;
    }

    setPendingTx(true);
    try {
      const contract = new ethers.Contract(POLL_CONTRACT, pollAbi, user.provider);
      const sentTx = await contract.connect(user.signer)[func](...args);
      await sentTx.wait();
      await refetch();
    } finally {
      setPendingTx(false);
    }
  };
  const onClickVoteCat = async () => sendTx({ func: "voteCat" });
  const onClickVoteDog = async () => sendTx({ func: "voteDog" });
  const onClickReset = async () => {
    if (user && user.address != data?.owner) {
      alert("You are not the owner.");
      return;
    }
    sendTx({ func: "reset" });
  };

  return (
    <div>
      <Row>
        <Col>
          <p>RPC_ENDPOINT: {RPC_ENDPOINT}</p>
          <p>POLL_CONTRACT: {POLL_CONTRACT}</p>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <Stack gap={2}>
            <Stack gap={1} className="align-items-center">
              <Image src={catPng} style={{ width: 200, height: 200 }} />
              <Button variant="primary" className="w-100" disabled={pendingTx} onClick={onClickVoteCat}>
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
              <Button variant="primary" className="w-100" disabled={pendingTx} onClick={onClickVoteDog}>
                Vote
              </Button>
            </Stack>
            <Form.Text style={{ fontSize: 24 }}>
              <b>Dog : </b> {data?.dogs.toString()}
            </Form.Text>
          </Stack>
        </Col>
      </Row>

      <hr />
      <Row>
        <Col>
          <Button variant="danger" className="w-100" disabled={pendingTx} onClick={onClickReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
