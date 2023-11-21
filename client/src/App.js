import react, { useEffect } from "react";
import { Input, VStack } from "@chakra-ui/react";
import socket from "./socket";

const App = () => {
  const [index, setIndex] = react.useState([]);

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
  };

  return (
    <VStack
      bg={"#ddd"}
      w={"100vw"}
      h={"100vh"}
      align={"center"}
      justify={"center"}
    >
      {index.length > 0
        ? index.map((e, i) => (
            <Input
              key={e.index}
              bg={"#fff"}
              w={"sm"}
              value={e.text}
              onChange={(e) => inputHandler(e.target.value, i)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  indexHandler(i + 1);
                }
              }}
            />
          ))
        : null}
      {/* <Text>TEXT: {data}</Text>
      <Textarea
        w={"lg"}
        rounded={"md"}
        outline={"none"}
        minH={"md"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        _focusVisible={{
          outline: "none",
        }}
      /> */}
    </VStack>
  );
};

export default App;
