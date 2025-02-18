{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.11";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = {
    self,
    nixpkgs,
    nixpkgs-unstable,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem
    (
      system: let
        pkgs = import nixpkgs {
          system = system;
        };
        pkgs-unstable = import nixpkgs-unstable {
          system = system;
        };

        common = with pkgs; [
          nodejs_23
          corepack_23
        ];

        unstable = with pkgs-unstable; [
          rustywind
          jq
        ];

        # runtime Deps
        libraries = with pkgs;
          [
          ]
          ++ common;

        # compile-time deps
        packages = with pkgs;
          [
          ]
          ++ common ++ unstable;
      in {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = packages;
          buildInputs = libraries;
          shellHook = ''
            echo "🚀 Development environment loaded"
          '';
        };

        formatter = pkgs.alejandra;
      }
    );
}
