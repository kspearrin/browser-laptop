/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const ImmutableComponent = require('../../../js/components/immutableComponent')
const {StyleSheet, css} = require('aphrodite/no-important')
const globalStyles = require('./styles/global')

/**
 * Boilerplate component for all tab icons
 */
class TabIcon extends ImmutableComponent {
  render () {
    const tabIconStyle = {
      // Currently it's not possible to concatenate Aphrodite generated classes
      // and pre-built classes using default Aphrodite API, so we keep with inline-style
      fontSize: 'inherit',
      display: 'flex',
      alignSelf: 'center',
      width: '16px',
      height: '16px',
      alignItems: 'center',
      justifyContent: 'center'
    }
    return <div className={this.props.className} onClick={this.props.onClick}>
      {
      this.props.symbol
        ? <span
          className={this.props.symbol}
          data-l10n-id={this.props.l10nId}
          data-l10n-args={JSON.stringify(this.props.l10nArgs || {})}
          style={tabIconStyle} />
        : null
      }
    </div>
  }
}

class Favicon extends ImmutableComponent {
  get favicon () {
    return !this.props.isLoading && this.props.tabProps.get('icon')
  }

  get loadingIcon () {
    return this.props.isLoading
      ? globalStyles.appIcons.loading
      : null
  }

  get defaultIcon () {
    return (!this.props.isLoading && !this.favicon)
      ? globalStyles.appIcons.defaultIcon
      : null
  }

  render () {
    const iconStyles = StyleSheet.create({
      favicon: {backgroundImage: `url(${this.favicon})`}
    })
    return this.props.tabProps.get('location') !== 'about:newtab'
      ? <TabIcon
        data-test-favicon={this.favicon}
        className={css(styles.icon, this.favicon && iconStyles.favicon)}
        symbol={this.loadingIcon || this.defaultIcon} />
      : null
  }
}

class AudioTabIcon extends ImmutableComponent {
  get pageCanPlayAudio () {
    return this.props.tabProps.get('audioPlaybackActive') || this.props.tabProps.get('audioMuted')
  }

  get narrowView () {
    const sizes = ['medium', 'mediumSmall', 'small', 'extraSmall', 'smallest']
    return sizes.includes(this.props.tabProps.get('breakpoint'))
  }

  get locationHasSecondaryIcon () {
    return !!this.props.tabProps.get('isPrivate') || !!this.props.tabProps.get('partitionNumber')
  }

  get mutedState () {
    return this.pageCanPlayAudio && this.props.tabProps.get('audioMuted')
  }

  get unmutedState () {
    this.props.tabProps.get('audioPlaybackActive') && !this.props.tabProps.get('audioMuted')
  }

  get audioIcon () {
    return !this.mutedState
      ? globalStyles.appIcons.volumeOn
      : globalStyles.appIcons.volumeOff
  }

  render () {
    return this.pageCanPlayAudio && !this.narrowView
      ? <TabIcon className={css(styles.icon, styles.audioIcon)} symbol={this.audioIcon} onClick={this.props.onClick} />
      : null
  }
}

class PrivateIcon extends ImmutableComponent {
  get narrowView () {
    const sizes = ['small', 'extraSmall', 'smallest']
    return sizes.includes(this.props.tabProps.get('breakpoint'))
  }

  render () {
    return this.props.tabProps.get('isPrivate') && !this.props.tabProps.get('hoverState') && !this.narrowView
      ? <TabIcon className={css(styles.icon)} symbol={globalStyles.appIcons.private} />
      : null
  }
}

class NewSessionIcon extends ImmutableComponent {
  get narrowView () {
    const sizes = ['small', 'extraSmall', 'smallest']
    return sizes.includes(this.props.tabProps.get('breakpoint'))
  }

  render () {
    return this.props.tabProps.get('partitionNumber') && !this.props.tabProps.get('hoverState') && !this.narrowView
    ? <TabIcon className={css(styles.icon)} symbol={globalStyles.appIcons.newSession} {...this.props} />
    : null
  }
}

class TabTitle extends ImmutableComponent {
  get locationHasSecondaryIcon () {
    return !!this.props.tabProps.get('isPrivate') || !!this.props.tabProps.get('partitionNumber')
  }

  get isPinned () {
    return !!this.props.tabProps.get('pinnedLocation')
  }

  get pageCanPlayAudio () {
    return this.props.tabProps.get('audioPlaybackActive') || this.props.tabProps.get('audioMuted')
  }

  get shouldHideTitle () {
    return (this.props.tabProps.get('breakpoint') === 'largeMedium' && this.pageCanPlayAudio && this.locationHasSecondaryIcon) ||
      (this.props.tabProps.get('breakpoint') === 'mediumSmall' && this.locationHasSecondaryIcon) ||
      this.props.tabProps.get('breakpoint') === 'extraSmall' || this.props.tabProps.get('breakpoint') === 'smallest'
  }

  get titleCSSClass () {
    return css(
      styles.tabTitle,
      // Windows specific style
      process.platform === 'win32' && styles.tabTitleForWindows,
      // Linux specific style
      process.platform === 'linux' && styles.tabTitleForLinux
    )
  }

  render () {
    return !this.isPinned && !this.shouldHideTitle
    ? <div className={this.titleCSSClass}>{this.props.pageTitle}</div>
    : null
  }
}

class CloseTabIcon extends ImmutableComponent {
  get isPinned () {
    return !!this.props.tabProps.get('pinnedLocation')
  }

  get narrowView () {
    const sizes = ['extraSmall', 'smallest']
    return sizes.includes(this.props.tabProps.get('breakpoint'))
  }

  render () {
    return this.props.tabProps.get('hoverState') && !this.narrowView && !this.isPinned
      ? <TabIcon className={css(styles.closeTab)} symbol={globalStyles.appIcons.closeTab} {...this.props} />
      : null
  }
}

const styles = StyleSheet.create({
  icon: {
    width: '16px',
    minWidth: '16px',
    height: '16px',
    backgroundSize: '16px',
    fontSize: globalStyles.fontSize.tabIcon,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    alignSelf: 'center',
    position: 'relative',
    textAlign: 'center',
    justifyContent: 'center',
    padding: globalStyles.spacing.defaultIconPadding
  },

  iconNarrowView: {
    padding: 0
  },

  audioIcon: {
    color: globalStyles.color.highlightBlue
  },

  closeTab: {
    opacity: '0.7',
    // background: 'linear-gradient(to left, rgba(255,255,255, 1) 20%, rgba(255,255,255, 0) 80%)',
    position: 'absolute',
    top: '0',
    right: '0',
    padding: '0 4px',
    borderTopRightRadius: globalStyles.radius.borderRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    width: '16px',
    height: '100%',
    border: '0',
    zIndex: globalStyles.zindex.zindexTabs,

    ':hover': {
      opacity: '1'
    }
  },

  tabTitle: {
    WebkitUserSelect: 'none',
    boxSizing: 'border-box',
    fontSize: globalStyles.fontSize.tabTitle,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    height: '15px',
    padding: globalStyles.spacing.defaultTabPadding
  },

  tabTitleForWindows: {
    fontWeight: '500',
    fontSize: globalStyles.fontSize.tabTitle,
    height: '18px'
  },

  tabTitleForLinux: {
    height: globalStyles.fontSize.tabTitle
  }
})

module.exports = {
  Favicon,
  AudioTabIcon,
  NewSessionIcon,
  PrivateIcon,
  TabTitle,
  CloseTabIcon
}
