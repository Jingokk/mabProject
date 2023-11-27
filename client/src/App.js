import react, { useEffect } from "react";
import { Input, VStack } from "@chakra-ui/react";
import socket from "./socket";

const App = () => {
  const [index, setIndex] = react.useState([]);
  const [inputIndex, setInputIndex] = react.useState(0);
  const myRefs = react.useRef([]);

  useEffect(() => {
    socket.on("initialTable", (table) => {
      setIndex(table);
    });

    socket.on("room", (data) => {
      setIndex(data);
    });
  }, []);

  const inputHandler = (data, ind) => {
    let clone = [...index];
    clone[ind].text = data;
    setIndex(clone);
    socket.emit("message", clone);
  };

  const indexHandler = (i) => {
    socket.emit("index", i);
    setInputIndex(i);
  };

  return (
    <VStack
      bg={"#ddd"}
      w={"full"}
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      spacing={0}
      overflowY={"auto"}
      overflowX={"hidden"}
      py={"10"}
      px={["10", "10", "16", "44", "44"]}
    >
      {index.length > 0
        ? index.map((e, i) => (
            <Input
              ref={(el) => (myRefs.current[i] = el)}
              key={e.index}
              bg={"#fff"}
              w={"full"}
              rounded={"none"}
              value={e.text}
              maxLength={200}
              border={"none"}
              onChange={(e) => inputHandler(e.target.value, i)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  indexHandler(i + 1);
                  if (myRefs.current[i + 1]) {
                    myRefs.current[i + 1].focus();
                  }
                }
                if (e.key === "ArrowUp") {
                  if (myRefs.current[i - 1]) {
                    myRefs.current[i - 1].focus();
                  }
                }
                if (e.key === "ArrowDown") {
                  if (myRefs.current[i + 1]) {
                    myRefs.current[i + 1].focus();
                  }
                }
              }}
              autoFocus={inputIndex === i ? true : false}
              _focusVisible={{
                outline: "none",
              }}
            />
          ))
        : null}
    </VStack>
  );
};

export default App;
