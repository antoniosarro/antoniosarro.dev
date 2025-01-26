{
  description = "A Nix-flake-based Node development environment";

  inputs.nixpkgs.url = "https://flakehub.com/f/NixOS/nixpkgs/0.1.*.tar.gz";

  outputs = {
    self,
    nixpkgs,
  }: let
    allSystems = ["x86_64-linux"];

    forAllSystems = fn:
      nixpkgs.lib.genAttrs allSystems
      (system: fn {pkgs = import nixpkgs {inherit system;};});
  in {
    devShells = forAllSystems ({pkgs}: {
      default = pkgs.mkShell {
        shellHook = ''
            echo "🚀 Welcome to Node development environment"
	          echo "Node version: $(node -v)"
	          echo "Pnpm version: $(pnpm -v)"
        '';
        packages = with pkgs; [
          # Node
          nodejs_23
          nodePackages.pnpm

          rustywind
          jq
        ];
      };
    });
  };
}
