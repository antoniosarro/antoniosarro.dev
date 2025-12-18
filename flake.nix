{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    nixpkgs-unstable,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          system = system;
        };
        pkgs-unstable = import nixpkgs-unstable {
          system = system;
        };

        # Node.js environment
        nodePackages = with pkgs-unstable; [
          nodejs_25
          pnpm
        ];

        # Python with font optimization tools
        pythonEnv = pkgs.python3.withPackages (ps: with ps; [
          fonttools      # pyftsubset and other font utilities
          brotli         # Compression for woff2
          zopfli         # Better compression
          pip            # For additional packages if needed
        ]);

        # Font-related tools
        fontTools = with pkgs; [
          pythonEnv
          fontforge      # Advanced font editing (optional)
          woff2          # WOFF2 compression tools (optional)
        ];

        # Development tools
        devTools = with pkgs-unstable; [
          rustywind      # Tailwind class sorter
          jq             # JSON processor
        ];

        # All runtime dependencies
        libraries = nodePackages ++ fontTools;

        # All build/dev dependencies
        packages = nodePackages ++ fontTools ++ devTools;
      in {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = packages;
          buildInputs = libraries;
          
          shellHook = ''
            # Color definitions
            RED='\033[0;31m'
            GREEN='\033[0;32m'
            YELLOW='\033[1;33m'
            BLUE='\033[0;34m'
            CYAN='\033[0;36m'
            NC='\033[0m' # No Color

            echo -e "''${GREEN}🚀 Development environment loaded''${NC}"
            echo ""
            echo -e "''${BLUE}📦 Available tools:''${NC}"
            echo "  • Node.js $(node --version)"
            echo "  • pnpm $(pnpm --version)"
            echo "  • Python $(python --version 2>&1 | cut -d' ' -f2)"
            echo "  • pyftsubset $(pyftsubset --version 2>/dev/null || echo 'installed')"
            echo ""
            echo -e "''${YELLOW}🔤 Font optimization tools:''${NC}"
            echo "  • fonttools (pyftsubset, ttx, etc.)"
            echo "  • brotli compression"
            echo "  • zopfli compression"
            echo ""
            echo -e "''${GREEN}🚀 Quick commands:''${NC}"
            echo "  • pnpm run build                      - Build the project"
            echo "  • pnpm run optimize:fonts:pyftsubset  - Optimize fonts (native, fast)"
            echo "  • pnpm run build:prod                 - Build with font optimization"
            echo ""
            
            # Verify tools are available
            if command -v pyftsubset &> /dev/null; then
              echo -e "''${GREEN}✓ pyftsubset available''${NC}"
            else
              echo -e "''${RED}✗ pyftsubset not found''${NC}"
            fi
            echo ""
          '';

          # Additional environment variables for font optimization
          FONTTOOLS_AVAILABLE = "1";
          PYFTSUBSET_PATH = "${pythonEnv}/bin/pyftsubset";
        };

        formatter = pkgs.alejandra;

        # Checks to verify all tools are working
        checks = {
          font-tools-check = pkgs.runCommand "check-font-tools" {
            buildInputs = [ pythonEnv ];
          } ''
            pyftsubset --help > /dev/null
            echo "Font tools OK" > $out
          '';
        };
      }
    );
}