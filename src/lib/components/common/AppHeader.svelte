<script lang="ts">
  import { goto } from '$app/navigation';

  interface Props {
    isScrolled?: boolean;
    showAvatarMenu?: boolean;
    hasDropdownMenu?: boolean;
    onToggleAvatarMenu?: () => void;
    onSettings?: () => void;
    onLogout?: () => void;
    onClickOutside?: (e: MouseEvent) => void;
  }

  let {
    isScrolled = $bindable(false),
    showAvatarMenu = $bindable(false),
    hasDropdownMenu = true,
    onToggleAvatarMenu = () => {},
    onSettings = () => {},
    onLogout = () => {},
    onClickOutside = () => {}
  }: Props = $props();

  function handleLogoClick() {
    goto('/dashboard');
  }
</script>

<svelte:window onclick={onClickOutside} />

<header class="fixed top-0 left-0 right-0 z-[10000]">
  <div class="header-container px-3 sm:px-4" class:scrolled={isScrolled}>
    <div class="header-glass mx-auto py-2" class:scrolled={isScrolled}>
      <div class="flex items-center justify-between px-4">
        <button type="button" class="flex items-center logo-button" onclick={handleLogoClick}>
          <h1 class="text-2xl font-bold text-white">Elarin B2B</h1>
        </button>

        <div class="flex items-center gap-2 sm:gap-4">
          <div
            class="glass-button w-18 h-6 sm:w-20 sm:h-8 flex items-center justify-center rounded-full"
          >
            <span class="text-white text-xs font-semibold whitespace-nowrap">PARTNER</span>
          </div>

          <div class="avatar-menu-container">
            <button
              type="button"
              class="glass-button-round w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center overflow-hidden p-0"
              aria-label="Menu da organização"
              onclick={onToggleAvatarMenu}
            >
              <svg
                class="w-4 h-4 sm:w-6 sm:h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </button>

            {#if hasDropdownMenu}
              <div class="dropdown-menu" class:show={showAvatarMenu}>
                <button type="button" class="menu-item menu-item-settings w-full text-left" onclick={onSettings}>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Configurações
                </button>
                <button type="button" class="menu-item menu-item-logout w-full text-left" onclick={onLogout}>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sair
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</header>

<style>
  .glass-button {
    background: var(--color-glass-light);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
  }

  .glass-button-round {
    background: var(--color-glass-light);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border-radius: 50%;
    position: relative;
    overflow: hidden;
  }

  .glass-button-round:hover {
    background: var(--color-border-light);
  }

  .header-container {
    transition: all 0.3s ease;
    padding: 0;
  }

  .header-container.scrolled {
    padding: 8px;
  }

  .header-glass {
    transition: all 0.3s ease;
    width: 100%;
  }

  .header-glass.scrolled {
    background: var(--color-glass-dark);
    backdrop-filter: blur(var(--blur-md));
    -webkit-backdrop-filter: blur(var(--blur-md));
    border-radius: 16px;
  }

  .avatar-menu-container {
    position: relative;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 180px;
    background: var(--color-glass-dark-strong);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--color-border-light);
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
    transition: var(--transition-base);
  }

  .dropdown-menu.show {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    color: var(--color-text-primary);
    border-radius: 8px;
    transition: var(--transition-base);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .menu-item:hover {
    background: var(--color-border-light);
  }

  .menu-item-settings {
    color: var(--color-text-primary);
  }

  .menu-item-settings:hover {
    background: rgba(142, 180, 40, 0.1);
    color: var(--color-primary-500);
  }

  .menu-item-logout {
    color: var(--color-error);
  }

  .menu-item-logout:hover {
    background: rgba(255, 68, 68, 0.1);
  }

  .logo-button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.2s ease;
  }

  .logo-button:hover {
    opacity: 0.8;
  }

  @media (max-width: 640px) {
    .logo-button h1 {
      font-size: 1.25rem;
    }
  }
</style>
