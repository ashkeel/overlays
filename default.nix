{ mkBunDerivation, ... }:
mkBunDerivation {
  pname = "ashkeel-overlays";
  #version = "0.1.0";

  packageJson = ./package.json;
  src = ./.;
  bunNix = ./bun.nix;

  buildPhase = ''
    runHook preBuild

    bun run build

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    cp -r dist $out

    runHook postInstall
  '';
}
