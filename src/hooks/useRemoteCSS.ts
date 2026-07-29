import { useEffect, useState } from "react";

interface FederatedStats {
  federatedModules?: Array<{
    remote: string;
    exposes?: Record<string, string[]>;
  }>;
}

export function useRemoteCSS(
  remoteBaseUrl: string,
  remoteName: string,
  exposedModule: string,
) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 1. Jika di Development Mode lokal, biarkan Host scanning tailwind.config yang menangani styles.
    // Hal ini memberikan pengalaman dev yang responsif (HMR & Fast Refresh bekerja penuh).
    if (process.env.NODE_ENV === "development") {
      setLoaded(true);
      return;
    }

    let isMounted = true;
    const injectedLinks: HTMLLinkElement[] = [];

    const loadCSS = async () => {
      try {
        const baseUrl = remoteBaseUrl.replace(/\/+$/, "");

        // 2. Fetch data manifest federated-stats.json dari API Remote MFE
        const response = await fetch(`${baseUrl}/api/federated-stats`);
        if (!response.ok) {
          throw new Error(`Gagal memuat federated-stats.json dari ${baseUrl}`);
        }

        const stats: FederatedStats & { globalCSS?: string[] } =
          await response.json();

        // 3. Gabungkan berkas CSS dari manifest _app (globalCSS) dan exposes (jika ada)
        const cssFiles = [...(stats.globalCSS || [])];

        const moduleStats = stats.federatedModules?.find(
          (m) => m.remote === remoteName,
        );
        if (moduleStats) {
          const assets = moduleStats.exposes?.[exposedModule] || [];
          assets.forEach((asset) => {
            if (asset.endsWith(".css") && !cssFiles.includes(asset)) {
              cssFiles.push(asset);
            }
          });
        }

        if (cssFiles.length === 0) {
          if (isMounted) setLoaded(true);
          return;
        }

        // 4. Suntikkan berkas CSS ke head dokumen Host
        cssFiles.forEach((cssPath) => {
          const fullCssUrl =
            cssPath.startsWith("http") || cssPath.startsWith("/")
              ? cssPath
              : `${baseUrl}/_next/${cssPath}`;

          // Mencegah duplikasi injeksi jika link stylesheet tersebut sudah ada
          const existingLink = document.querySelector(
            `link[href="${fullCssUrl}"]`,
          );
          if (!existingLink) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = fullCssUrl;
            link.dataset.mfe = remoteName; // Memberikan attribute custom untuk cleanup

            document.head.appendChild(link);
            injectedLinks.push(link);
          }
        });

        if (isMounted) setLoaded(true);
      } catch (err: any) {
        console.error(`[useRemoteCSS] Gagal memuat style:`, err);
        if (isMounted) setError(err);
      }
    };

    loadCSS();

    // Cleanup: Hapus tag link CSS yang di-inject ketika komponen MFE di-unmount
    return () => {
      isMounted = false;
      injectedLinks.forEach((link) => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [remoteBaseUrl, remoteName, exposedModule]);

  return { loaded, error };
}
