import React from "react";

// Adds `notificationPermission`, `requestPermission` and `createNotification`
// to the props

let Notification = window.Notification;

export let useNotification = () => {
  let [permission, set_permission] = React.useState(Notification.permission);

  if (!("Notification" in window)) {
    return {
      permission: "denied",
      requestPermission: () => {},
      create: () => {},
    };
  }

  let createNotification = (title, options) => {
    if (permission !== "granted") {
      return null;
    }
    return new Notification(title, options);
  };

  let requestPermission = (cb) => {
    if (permission === "denied") {
      return null;
    }
    Notification.requestPermission((permission) => {
      set_permission(permission);
    });
  };

  return { create: createNotification, requestPermission, permission };
};
