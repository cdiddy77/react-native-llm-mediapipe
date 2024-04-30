import { StyleSheet, type ViewStyle } from 'react-native';

export const colors = {
  primary: '#1292B4',
  white: '#FFF',
  lighter: '#F3F3F3',
  light: '#DAE1E7',
  dark: '#444',
  darker: '#222',
  black: '#000',
};

export const typogs = {
  body1: {
    fontSize: 16,
  },
  message: {
    fontSize: 12,
  },
  button: {
    fontSize: 16,
  },
};

const CenteredRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DebugBorder: ViewStyle = {
  borderWidth: 1,
  borderColor: 'red',
  borderStyle: 'solid',
};

export const styles = StyleSheet.create({
  root: { flexDirection: 'column', height: '100%' },
  keyboardRoot: { flexDirection: 'column', height: '100%' },
  promptInnerContainer: { flex: 1 },
  row: { ...CenteredRowStyle },
  promptRow: {
    ...CenteredRowStyle,
    marginHorizontal: 12,
    paddingBottom: 12,
    marginVertical: 20,
  },
  messagesScrollView: { flex: 1 },
  messagesContainer: { justifyContent: 'flex-end', flex: 1 },
  message: {
    backgroundColor: colors.dark,
    padding: 12,
    margin: 12,
    borderRadius: 12,
  },
  messageText: { ...typogs.message, color: colors.white },
  promptInput: {
    ...typogs.body1,
    flex: 1,
    color: colors.light,
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.white,
    borderStyle: 'solid',
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  samplePromptButton: { marginLeft: 12, paddingHorizontal: 16 },
  samplePromptButtonText: {
    ...typogs.button,
    color: colors.white,
  },
  sendButton: { marginLeft: 12 },
  sendButtonText: {
    ...typogs.button,
    color: colors.white,
  },
});
