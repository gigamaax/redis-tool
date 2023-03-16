import styled from "@emotion/styled";

export const Output = ({ text }: { text: string }) => {
  return (
    <Container>
      <OutputLabel>Output</OutputLabel>
      <ContentContainer>
        <Content>{text}</Content>
      </ContentContainer>
    </Container>
  );
};

const OutputLabel = styled.label`
  font-size: small;
  color: #aaaaaa;
`;

const Content = styled.code`
  color: #555555;
  width: 100%;
`;

const ContentContainer = styled.pre`
  margin: 0;
  padding: 0.5rem 1rem;
  min-height: 1rem;
  max-height: 16rem;
  overflow: hidden;
  overflow-y: auto;
  background: #eeeeee;
  border-radius: 4px;
`;

const Container = styled.div`
  margin-top: 0.5rem;
`;
