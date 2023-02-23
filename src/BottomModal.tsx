import * as React from 'react';
import {
  Animated, Dimensions, Easing, KeyboardAvoidingView,
  Modal, Platform, SafeAreaView, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle
} from 'react-native';

interface BottomModalProps {
  children?: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
  hasMask?: boolean
  touchOutsideClose?: boolean
  backKeyClose?: boolean
  keyboardAvoid?: boolean
  onShow?: () => void
  onDismiss?: () => void
}

const screenHeight = Dimensions.get('screen').height
const isAndroid = Platform.OS === 'android'
const isIOS = Platform.OS === 'ios'

class State {
  visible = false
  height = new Animated.Value(screenHeight)
}

/**
 * 自定义底部弹出Modal
*/
export default class BottomModal extends React.Component<BottomModalProps, State>{

  private readonly targetProps: BottomModalProps
  private startOpenAnimtion = false

  private openAnimation: Animated.CompositeAnimation
  private closeAnimation: Animated.CompositeAnimation
  private dismissTimeOut: any = undefined

  constructor(props: BottomModalProps) {
    super(props)
    this.state = new State()
    this.openAnimation = Animated.timing(this.state.height, { toValue: 0, duration: 300, easing: Easing.in(Easing.quad), useNativeDriver: false })
    this.closeAnimation = Animated.timing(this.state.height, { toValue: screenHeight, duration: 250, easing: Easing.out(Easing.quad), useNativeDriver: false })
    this.targetProps = Object.assign({ hasMask: true, touchOutsideClose: true, backKeyClose: true }, props)
  }

  show() {
    this.setState({ visible: true })
  }

  dismiss() {
    if (this.state.visible) {
      this.openAnimation.stop()
      this.closeAnimation.stop()
      this.closeAnimation.start(() => {
        this.setState({ visible: false }, () => {
          if (isAndroid) {
            this.props.onDismiss && this.props.onDismiss()
          } else {
            //[bug]RN0.63.0 IOS not call onDismiss
            this.dismissTimeOut = setTimeout(() => {
              this.dismissTimeOut = undefined
              this.props.onDismiss && this.props.onDismiss()
            }, 700)
          }
        })
        this.startOpenAnimtion = false
      })
    }
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        transparent={true}
        animationType='fade'
        onShow={() => {
          this.props.onShow && this.props.onShow()
        }}
        onRequestClose={() => {
          if (this.targetProps.backKeyClose) {
            this.dismiss()
          }
        }}
        onDismiss={() => {
          //[bug]RN0.63.0 IOS not call onDismiss
          if (this.dismissTimeOut) {
            clearTimeout(this.dismissTimeOut)
            this.dismissTimeOut = undefined
            this.props.onDismiss && this.props.onDismiss()
          }
        }}>
        <View style={[{ flex: 1 }, this.targetProps.hasMask ? { backgroundColor: 'rgba(0,0,0, 0.5)' } : null]}>
          <TouchableOpacity style={{ flex: 1 }}
            onPress={() => {
              if (this.targetProps.touchOutsideClose) {
                this.dismiss()
              }
            }} activeOpacity={1} />
          <Animated.View style={{ height: this.state.height }} />
          <SafeAreaView style={[styles.childrenDefaultContainer, this.props.containerStyle]}
            onLayout={() => {
              if (!this.startOpenAnimtion) {
                this.startOpenAnimtion = true
                this.openAnimation.start()
              }
            }} >
            {this.props.children}
          </SafeAreaView>
          {this.props.keyboardAvoid ? <KeyboardAvoidingView behavior={'padding'} enabled={isIOS} /> : null}
        </View>

      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  childrenDefaultContainer: {
    backgroundColor: 'white',
    overflow: 'hidden'
  }
})
