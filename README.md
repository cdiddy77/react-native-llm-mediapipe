# react-native-llm-mediapipe

`react-native-llm-mediapipe` enables developers to run large language models (LLMs) on iOS and Android devices using React Native. This package allows you to write JavaScript or TypeScript to handle LLM inference directly on mobile platforms.

## Features

- **Run LLM Inference**: Perform natural language processing tasks directly on mobile devices.
- **React Native Integration**: Seamlessly integrates with your existing React Native projects.
- **JavaScript/TypeScript Support**: Use familiar technologies to control LLM functionality.

## Installation

To get started with `react-native-llm-mediapipe`, install the package using npm or yarn:

```bash
npm install react-native-llm-mediapipe
```

or

```bash
yarn add react-native-llm-mediapipe
```

## Requirements

Before using this package, you must download or build the LLM model files necessary for its operation. Ensure these model files are properly configured and accessible by your mobile application. Some instructions can be found on [the MediaPipe page](https://developers.google.com/mediapipe/solutions/genai/llm_inference).

## Usage

The primary functionality of this package is accessed through the useLlmInference() hook. This hook provides a generateResponse function, which you can use to process text prompts. Here is a basic example of how to use it in a React Native app:

```tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useLlmInference } from 'react-native-llm-mediapipe';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const { generateResponse } = useLlmInference();

  const handleGeneratePress = async () => {
    const response = await generateResponse(prompt);
    alert(response); // Display the LLM's response
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
        }}
        onChangeText={setPrompt}
        value={prompt}
        placeholder="Enter your prompt here"
      />
      <Button title="Generate Response" onPress={handleGeneratePress} />
    </View>
  );
};

export default App;
```

In addition, you can access partial results by supplying a callback to `generateResponse()`

```tsx
   const response = await llmInference.generateResponse(
      prompt,
      (partial) => {
        setPartialResponse((prev) => prev + partial));
      }
    );

```

## Contributing

Contributions are very welcome! If you would like to improve react-native-llm-mediapipe, please feel free to fork the repository, make changes, and submit a pull request. You can also open an issue if you find bugs or have feature requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, feature requests, or any other inquiries, please open an issue on the GitHub project page.
