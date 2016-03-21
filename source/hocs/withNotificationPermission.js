import React from 'react'

// Adds `notificationPermission`, `requestPermission` and `createNotification`
// to the props

let Notification = window.Notification

let withNotificationPermission = Component => {
  if (!('Notification' in window)) {
    return props => {
      return (
        <Component
          {...props}
          Notification={{
            permission: 'denied',
            requestPermission: Function.prototype,
            create: Function.prototype,
          }}
        />
      )
    }
  }

  return class extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.state = {
        permission: Notification.permission,
      }
    }

    render() {
      let notificationPermission = this.state.permission

      let createNotification = (title, options) => {
        if (notificationPermission !== 'granted') {
          return null
        }
        return new Notification(title, options)
      }

      let requestPermission = (cb) => {
        if (notificationPermission === 'denied') {
          return null
        }
        Notification.requestPermission(permission => {
          this.setState({permission})
          cb && cb(permission)
        })
      }

      return (
        <Component
          {...this.props}
          Notification={{
            permission: notificationPermission,
            requestPermission: requestPermission,
            create: createNotification,
          }}
        />
      )
    }
  }
}

export default withNotificationPermission
