import React from 'react'

import { FacebookMessengerDetails } from './im/facebook-messenger'

const TODODetails = ({summary}) => {
  return <div>
    {JSON.stringify(summary, null, 2)}
  </div>
}

const detailsMap = {
  FacebookMessenger: FacebookMessengerDetails
}

export const renderDetails = (name, summary) => {
  const Component = detailsMap[name]
  if (summary) {
    summary = JSON.parse(summary)
  }
  if (!Component) {
    return <TODODetails summary={summary} />
  }
  return <Component summary={summary} />
}
