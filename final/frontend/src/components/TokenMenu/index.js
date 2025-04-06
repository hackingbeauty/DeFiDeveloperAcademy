import * as React from 'react';
import { 
    Menu as MaterialUIMenu,
    MenuItem,
    Button,
    Fade
} from '@material-ui/core'
import iconDownArrowWhiteSvg from 'assets/icons/icon-arrow-down-white.svg'
import ethToken from 'assets/icons/tokens/eth.png'
import daiToken from 'assets/icons/tokens/dai.png'
import usdtToken from 'assets/icons/tokens/usdt.png'
import rethToken from 'assets/icons/tokens/reth.png'
import usdcToken from 'assets/icons/tokens/usdc.png'
import wstethToken from 'assets/icons/tokens/wsteth-arbitrum.png'
import usdsToken from 'assets/icons/tokens/usds.png'
import uniToken from 'assets/icons/tokens/uni.png'
import udsceToken from 'assets/icons/tokens/usdc.e.png'
import wbtcToken from 'assets/icons/tokens/wbtc.png'
import wethToken from 'assets/icons/tokens/weth.png'
import lidoToken from 'assets/icons/tokens/lido.png'
import linkToken from 'assets/icons/tokens/link.png'
import mkrToken from 'assets/icons/tokens/mkr.png'
import compToken from 'assets/icons/tokens/comp.png'
import arbToken from 'assets/icons/tokens/arb.png'
import weethToken from 'assets/icons/tokens/weeth.png'
import usdeToken from 'assets/icons/tokens/usde.png'
import cbbtcToken from 'assets/icons/tokens/cbbtc.png'
import { styles } from './styles.scss'

const ITEM_HEIGHT = 18;
export default function TokenMenu(props) {
    const { children } = props
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        setAnchorEl(null);
        const selectedCurrency = event.target.dataset.currency 
        const selectedCurrencyElem = event.currentTarget
        props.onClose(selectedCurrency, selectedCurrencyElem)
    };

    return (
        <div className={`menu ${styles}`}>
            <Button
                id="fade-button"
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <div>
                    {children}
                    <span className="down-arrow-icon">
                        <img className="arrow-icon" 
                            src={iconDownArrowWhiteSvg}
                            alt="Arrow icon"
                        />
                    </span>
                </div>
            </Button>
            <MaterialUIMenu
                id="long-menu"
                className={styles}
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                slotprops={{
                    paper: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        }
                    }
                }}
            >
                <MenuItem data-currency="eth" selected={true}>
                    <img width="20" src={ethToken} />ETH
                </MenuItem>
                <MenuItem data-currency="dai" onClick={handleClose}>
                    <img width="20" src={daiToken} />DAI
                </MenuItem>
                <MenuItem data-currency="usdt" onClick={handleClose}>
                    <img width="20" src={usdtToken} />USDT
                </MenuItem>
                <MenuItem data-currency="reth" onClick={handleClose}>
                    <img width="20" src={rethToken} />RETH
                </MenuItem>
                <MenuItem data-currency="usdc" onClick={handleClose}>
                    <img width="20" src={usdcToken} />USDC
                </MenuItem>
                <MenuItem data-currency="wsteth" onClick={handleClose}>
                    <img width="20" src={wstethToken} />WSTETH
                </MenuItem>
                <MenuItem data-currency="usds" onClick={handleClose}>
                    <img width="20" src={usdsToken} />USDS
                </MenuItem>
                <MenuItem data-currency="uni" onClick={handleClose}>
                    <img width="20" src={uniToken} />UNI
                </MenuItem>
                <MenuItem data-currency="udsc.e" onClick={handleClose}>
                    <img width="20" src={udsceToken} />UDSC.E
                </MenuItem>
                <MenuItem data-currency="wbtc" onClick={handleClose}>
                    <img width="20" src={wbtcToken} />WBTC
                </MenuItem>
                <MenuItem data-currency="weth" onClick={handleClose}>
                    <img width="20" src={wethToken} />WETH
                </MenuItem>
                <MenuItem data-currency="ldo" onClick={handleClose}>
                    <img width="20" src={lidoToken} />LDO
                </MenuItem>
                <MenuItem data-currency="link" onClick={handleClose}>
                    <img width="20" src={linkToken} />LINK
                </MenuItem>
                <MenuItem data-currency="mkr" onClick={handleClose}>
                    <img width="20" src={mkrToken} />MKR
                </MenuItem>
                <MenuItem data-currency="comp" onClick={handleClose}>
                    <img width="20" src={compToken} />COMP
                </MenuItem>
                <MenuItem data-currency="arb" onClick={handleClose}>
                    <img width="20" src={arbToken} />ARB
                </MenuItem>
                <MenuItem data-currency="weeth" onClick={handleClose}>
                    <img width="20" src={weethToken} />WEETH
                </MenuItem>
                <MenuItem data-currency="usde" onClick={handleClose}>
                    <img width="20" src={usdeToken} />USDE
                </MenuItem>
                <MenuItem data-currency="cbbtc" onClick={handleClose}>
                    <img width="20" src={cbbtcToken} />CBBTC
                </MenuItem>
            </MaterialUIMenu>
        </div>
    );
}