import styled from "@emotion/styled";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import React, { useState } from "react";

import { trpc } from "./trpc";
import { Output } from "./Output";

export const App = () => {
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: "http://localhost:5555/trpc",
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Header>
          <HeaderContent>
            <H1>Redis Tool</H1>
            <p>A barebones Redis management utility</p>
          </HeaderContent>
        </Header>
        <Content>
          <KeysApplet />
          <GetApplet />
          <DeleteApplet />
          <FlushAllApplet />
        </Content>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const GetApplet = () => {
  const [input, setInput] = useState<string>("");
  const [pattern, setPattern] = useState<string>("");

  const { data = "" } = trpc.get.useQuery(pattern, {
    enabled: Boolean(pattern),
  });

  const onExecute = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPattern(input);
  };

  return (
    <Section id="get">
      <H2>
        <a href="#get">GET</a>
      </H2>
      <p>Get the value of a key</p>
      <form onSubmit={onExecute}>
        <label htmlFor="get-key">Key</label>
        <TextInput
          id="get-key"
          type="text"
          onChange={(e) => setInput(e.target.value)}
        />
        <SubmitButton
          type="submit"
          value="Execute GET"
          disabled={!Boolean(input)}
        />
      </form>
      <Output
        text={data ? JSON.stringify(JSON.parse(data), undefined, 2) : ""}
      />
    </Section>
  );
};

const KeysApplet = () => {
  const [input, setInput] = useState<string>("");
  const [pattern, setPattern] = useState<string>("");

  const { data = [] } = trpc.keys.useQuery(pattern, {
    enabled: Boolean(pattern),
  });
  const keys = data.join("\n");

  const onExecute = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPattern(input);
  };

  return (
    <Section id="keys">
      <H2>
        <a href="#keys">KEYS</a>
      </H2>
      <p>Find all keys matching the given pattern</p>
      <form onSubmit={onExecute}>
        <label htmlFor="keys-pattern">Pattern</label>
        <TextInput
          id="keys-pattern"
          type="text"
          onChange={(e) => setInput(e.target.value)}
        />
        <SubmitButton
          type="submit"
          value="Execute KEYS"
          disabled={!Boolean(input)}
        />
      </form>
      <Output text={keys} />
    </Section>
  );
};

const DeleteApplet = () => {
  const [input, setInput] = useState<string>("");

  const mutation = trpc.delete.useMutation();

  const onExecute = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const answer = window.confirm(
      `You are attempting to delete key ${input}. Continue?`
    );
    if (answer) {
      mutation.mutate(input);
    }
  };

  return (
    <Section id="del">
      <H2>
        <a href="#del">DEL</a>
      </H2>
      <p>Delete a key</p>
      <form onSubmit={onExecute}>
        <label htmlFor="del-key">Key</label>
        <TextInput
          id="del-key"
          type="text"
          onChange={(e) => setInput(e.target.value)}
        />
        <SubmitButton
          type="submit"
          value="Execute DEL"
          disabled={!Boolean(input)}
        />
      </form>
      {mutation.error ? (
        <Output text={mutation.error.message} />
      ) : (
        <Output
          text={
            mutation.data !== undefined ? `Deleted ${mutation.data} key(s)` : ""
          }
        />
      )}
    </Section>
  );
};

const FlushAllApplet = () => {
  const mutation = trpc.flushAll.useMutation();

  function onExecute(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const answer = window.prompt(
      "You are about to delete ALL KEYS from ALL DATABASES. Type 'flushall' to confirm."
    );
    if (answer === "flushall") {
      mutation.mutate();
    }
  }

  return (
    <Section id="flushall">
      <H2>
        <a href="#flushall">FLUSHALL</a>
      </H2>
      <p>Remove all keys from all databases</p>
      <form onSubmit={onExecute}>
        <SubmitButton type="submit" value="Execute FLUSHALL" />
      </form>
      <Output text={mutation.data || ""} />
    </Section>
  );
};

const H1 = styled.h1`
  margin: 0;
  padding: 0;
`;

const H2 = styled.h2`
  margin: 0;
  margin-bottom: 0.5rem;
  a {
    color: black;
    text-decoration: none;
    &:hover {
      color: black;
    }
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
  p {
    color: #555555;
  }
`;

const SubmitButton = styled.input``;

const TextInput = styled.input`
  margin: 0 0.5rem;
  font-family: monospace;
  min-width: 30vw;
`;

const HeaderContent = styled.div`
  padding: 0.5rem 1rem;
  color: black;

  p {
    margin: 0;
  }
`;

const Header = styled.header`
  background: lightcoral;
  margin-bottom: 2rem;
`;

const Content = styled.main`
  padding: 0 1rem;
`;
