import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { BottomModal } from 'react-native-bottom-modal';

const App = () => {
  const [show, setShow] = useState(false)
  const ref = React.createRef<BottomModal>()
  return (
    <SafeAreaView style={{ flexDirection: 'column' }}>
      <TouchableOpacity style={{
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50, backgroundColor: 'blue', borderRadius: 10, margin: 10
      }}
        onPress={() => {
          ref.current?.show()
        }}>
        <Text style={{ color: 'white', fontSize: 20 }}>show</Text>
      </TouchableOpacity>

      <BottomModal
        ref={ref}
        containerStyle={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}
        onShow={() => {
          console.info("show======")
        }}
        onDismiss={() => {
          console.info("dismiss======")
        }}>
        <Text style={{
          fontSize: 20,
          color: 'blue',
        }}>Content</Text>
      </BottomModal>

    </SafeAreaView>
  )
}

export default App