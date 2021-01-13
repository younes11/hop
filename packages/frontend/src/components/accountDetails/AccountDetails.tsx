import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Check from '@material-ui/icons/Check'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Transaction from 'src/models/Transaction'
import { useApp } from 'src/contexts/AppContext'
import Modal from 'src/components/modal/Modal'
import { useWeb3Context } from 'src/contexts/Web3Context'

const useStyles = makeStyles(() => ({
  header: {
    fontSize: '1.8rem'
  },
  box: {
    position: 'relative'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  statusIcon: {},
  network: {
    display: 'inline-block',
    marginRight: '0.5rem'
  },
  connectedWallet: {
    border: '1px solid #fff',
    padding: '2rem',
    marginBottom: '3rem',
    borderRadius: '1rem'
  },
  changeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem'
  },
  disconnectButton: {
    position: 'absolute',
    bottom: '1rem',
    right: '1rem',
    fontSize: '1.2rem',
    marginBottom: 0
  },
  clearButton: {
    fontSize: '1.2rem'
  },
  recentsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  address: {
    fontSize: '2rem'
  }
}))

const TransactionsList = (props: any) => {
  const { transactions, onClear } = props
  const styles = useStyles()

  return (
    <>
      <div className={styles.recentsHeader}>
        <Typography variant="h3" className={styles.header}>
          Recent transactions
        </Typography>
        <Button className={styles.clearButton} onClick={onClear}>
          (clear all)
        </Button>
      </div>
      {transactions
        .sort((a: any, b: any) => b.timestamp - a.timestamp)
        ?.map((tx: Transaction) => {
          return (
            <div key={tx.hash} className={styles.row}>
              <Link
                href={tx.explorerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.network}>{tx.networkName}:</span>{' '}
                {tx.truncatedHash} ↗
              </Link>
              <div className={styles.statusIcon}>
                {tx.pending ? (
                  <CircularProgress size={12} />
                ) : (
                  <Check color="primary" />
                )}
              </div>
            </div>
          )
        })}
    </>
  )
}

const ManageWallet = (props: any) => {
  const { onChange, onDisconnect } = props
  const styles = useStyles()
  const { address, walletName } = useWeb3Context()

  return (
    <div className={styles.connectedWallet}>
      Connected with {walletName}
      <Button className={styles.changeButton} onClick={onChange}>
        Change
      </Button>
      <Button className={styles.disconnectButton} onClick={onDisconnect}>
        Disconnect
      </Button>
      <div className={styles.address}>{address?.truncate()}</div>
    </div>
  )
}

const AccountDetails = () => {
  const styles = useStyles()
  const app = useApp()
  const { accountDetails } = app
  const transactions = app.txHistory?.transactions
  const { address, requestWallet, disconnectWallet } = useWeb3Context()

  if (!accountDetails?.open) {
    return null
  }

  const handleClose = () => {
    accountDetails.show(false)
  }

  const handleChangeClick = () => {
    handleClose()
    requestWallet()
  }

  const handleDisconnectClick = () => {
    handleClose()
    disconnectWallet()
  }

  const handleTransactionsClear = () => {
    app.txHistory?.clear()
  }

  return (
    <Modal onClose={handleClose}>
      <Box className={styles.box}>
        {!!address && (
          <ManageWallet
            onChange={handleChangeClick}
            onDisconnect={handleDisconnectClick}
          />
        )}
      </Box>
      <Box className={styles.box}>
        {transactions?.length ? (
          <TransactionsList
            transactions={transactions}
            onClear={handleTransactionsClear}
          />
        ) : (
          <Typography variant="body1">
            Your transactions will appear here...
          </Typography>
        )}
      </Box>
    </Modal>
  )
}

export default AccountDetails
