import styled from "@emotion/styled";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import React, { useState } from "react";

import { trpc } from "./trpc";
import { Output } from "./Output";

export const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:5555/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Header>
          <HeaderContent>
            <H1>Redis Tool</H1>
            <p>A barebones Redis utility</p>
          </HeaderContent>
        </Header>
        <Content>
          <KeysApplet />
          <GetApplet />
          <SetApplet />
          <DelApplet />
          {/* <FlushAllApplet /> */}
        </Content>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const SetApplet = () => {
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const mutation = trpc.set.useMutation();

  const onExecute = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const answer = window.confirm(
      `You are attempting to set key ${key} with value ${value}. Any existing value will be overwritten. Continue?`
    );
    if (answer) {
      mutation.mutate({ key, value });
    }
  };

  return (
    <Section id="set">
      <H2>
        <a href="#set">SET</a>
      </H2>
      <p>Set the string value of a key</p>
      <Form onSubmit={onExecute}>
        <TextInputLabel htmlFor="set-key">Key</TextInputLabel>
        <TextInput
          id="set-key"
          type="text"
          onChange={(e) => setKey(e.target.value)}
        />
        <TextInputLabel htmlFor="set-value">Value</TextInputLabel>
        <TextInput
          id="set-value"
          type="text"
          onChange={(e) => setValue(e.target.value)}
        />
        <SubmitButton
          type="submit"
          value="Execute SET"
          disabled={!Boolean(key && value)}
        />
      </Form>
      {mutation.error ? (
        <Output text={mutation.error.message} />
      ) : (
        <Output text={mutation.data || ""} />
      )}
    </Section>
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
      <Form onSubmit={onExecute}>
        <TextInputLabel htmlFor="get-key">Key</TextInputLabel>
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
      </Form>
      <Output
        text={data ? JSON.stringify(JSON.parse(data), undefined, 2) : data}
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
      <Form onSubmit={onExecute}>
        <TextInputLabel htmlFor="keys-pattern">Pattern</TextInputLabel>
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
      </Form>
      <Output text={keys} />
    </Section>
  );
};

const DelApplet = () => {
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
      <Form onSubmit={onExecute}>
        <TextInputLabel htmlFor="del-key">Key</TextInputLabel>
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
      </Form>
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
    <Section id="flushall" danger>
      <H2>
        <a href="#flushall">FLUSHALL</a>
      </H2>
      <p>Remove all keys from all databases</p>
      <Form onSubmit={onExecute}>
        <SubmitButton type="submit" value="Execute FLUSHALL" />
      </Form>
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

const Section = styled.section<{ danger?: boolean }>`
  padding: 1rem;
  border-radius: 8px;
  border: ${(p) => p.danger && "1px solid red"};
  //background: ${(p) => p.danger && "mistyrose"};
  margin-bottom: 1rem;

  p {
    color: #555555;
  }
`;

const SubmitButton = styled.input``;

const TextInputLabel = styled.label`
  margin-right: 0.5rem;
`;

const TextInput = styled.input`
  margin-right: 0.5rem;
  font-family: monospace;
  min-width: 30vw;
  height: 1.5rem;
`;

const Form = styled.form``;

const HeaderContent = styled.div`
  padding: 1rem 2rem;
  color: black;

  p {
    margin: 0;
  }
`;

const Header = styled.header`
  background: lightcoral;
  margin-bottom: 1rem;
`;

const Content = styled.main`
  padding: 0 1rem;
`;
