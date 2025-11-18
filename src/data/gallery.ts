function getPinnedAlbums(albums: Album[]): Album[] {
  return albums.filter((a) => a.pinned).slice(0, 3);
}

export function getAlbumsPinnedFirst(): Album[] {
  const pinned = getPinnedAlbums(albums);
  const notPinned = albums.filter((a) => !a.pinned);
  return [...pinned, ...notPinned];
}
export type Album = {
  title: string;
  date: string;
  folder: string;
  photos: string[];
  videos?: { src: string; title?: string }[];
  pinned?: {
    photos?: string[];
    videos?: { src: string; title?: string }[];
  };
};

export const albums: Album[] = [
  {
    title: "Zapata MC - Rio Claro",
    date: "15/11/2025",
    folder: "/uploads/zapata-15-11-2025",
    photos: ["/uploads/zapata-15-11-2025/foto-capa.jpeg"],
    videos: [
      {
        src: "/uploads/zapata-15-11-2025/video.mp4",
      },
    ],
    pinned: {
      videos: [
        {
          src: "/uploads/zapata-15-11-2025/video.mp4",
        },
      ],
      photos: ["/uploads/zapata-15-11-2025/foto-capa.jpeg"],
    },
  },
  {
    title: "Rock in Country - Itapira",
    date: "18/10/2025",
    folder: "/uploads/rock-in-country-18-10-2025",
    photos: [
      "/uploads/rock-in-country-18-10-2025/07f3d657-45e2-412d-ba93-42bac75ab25f.jpeg",
      "/uploads/rock-in-country-18-10-2025/0a7f80ed-e66f-4cc2-a997-bcceabfc7549.jpeg",
      "/uploads/rock-in-country-18-10-2025/11447e83-bde3-434f-a336-c1c2131d97cf.jpeg",
      "/uploads/rock-in-country-18-10-2025/1e2f2a9b-6fd5-4d49-9398-f4b673208b4b.jpeg",
      "/uploads/rock-in-country-18-10-2025/2506a0c2-cfc5-4243-a274-6c706ef2cb8d.jpeg",
      "/uploads/rock-in-country-18-10-2025/333195de-e3f3-46b2-87fb-3eb1fc1ad41a.jpeg",
      "/uploads/rock-in-country-18-10-2025/3b0c1e45-f753-485f-b45f-32274621e5b1.jpeg",
      "/uploads/rock-in-country-18-10-2025/4a08df21-9be3-4856-9cf5-85ad8a977103.jpeg",
      "/uploads/rock-in-country-18-10-2025/4edfc57e-8575-4d92-90db-c20dc9c0cc70.jpeg",
      "/uploads/rock-in-country-18-10-2025/50c8bc89-5397-414a-b4d1-47c911a94258.jpeg",
      "/uploads/rock-in-country-18-10-2025/50db1406-9548-4c24-acf1-9cb52bc8b258.jpeg",
      "/uploads/rock-in-country-18-10-2025/5952a006-9ae1-44d4-b4a5-76feaee96cee.jpeg",
      "/uploads/rock-in-country-18-10-2025/5fb8651a-50f5-48d9-8dfb-ad05f01bbee6.jpeg",
      "/uploads/rock-in-country-18-10-2025/6f979a6b-06e6-48ca-abf8-e3ca9c04115c.jpeg",
      "/uploads/rock-in-country-18-10-2025/706fe0cb-26a6-461c-87b2-7b2167f50890.jpeg",
      "/uploads/rock-in-country-18-10-2025/7ec251ab-e59d-400a-9d00-87f3d9d7a5f7.jpeg",
      "/uploads/rock-in-country-18-10-2025/80a91bd6-fbbd-4619-9c2c-4c72693da0ef.jpeg",
      "/uploads/rock-in-country-18-10-2025/899fd4d6-35de-4d8b-9394-c2cef2b58875.jpeg",
      "/uploads/rock-in-country-18-10-2025/8d245375-21ba-469b-83f9-82a8c54177cb.jpeg",
      "/uploads/rock-in-country-18-10-2025/91b6a054-b5c1-41c2-9018-7be88db410b2.jpeg", // pinned
      "/uploads/rock-in-country-18-10-2025/92dd4bc9-a8e0-4fec-a3d2-638cdeba22b8.jpeg",
      "/uploads/rock-in-country-18-10-2025/98fefbc0-1494-491e-ab5a-f5f74174dd38.jpeg",
      "/uploads/rock-in-country-18-10-2025/999420d9-6fc9-40f6-9e51-b85593efa694.jpeg",
      "/uploads/rock-in-country-18-10-2025/baf81568-71d1-4d1e-8c92-4a5a21b0885e.jpeg",
      "/uploads/rock-in-country-18-10-2025/bd572ecd-fc3a-4b61-abfa-7eca7368d07e.jpeg",
      "/uploads/rock-in-country-18-10-2025/cd4495ad-ebe4-4ab5-a533-0fee6a709ccf.jpeg",
      "/uploads/rock-in-country-18-10-2025/d1af96ac-f2f4-4ed9-94b1-914a5f644613.jpeg",
      "/uploads/rock-in-country-18-10-2025/dccdd8c6-eff6-42b3-848e-c8ba7d0955dc.jpeg",
      "/uploads/rock-in-country-18-10-2025/e68aa79e-e1ba-46f0-8419-d23552c47736.jpeg",
      "/uploads/rock-in-country-18-10-2025/ebba1c75-8fed-4696-89b7-4b7651c635d5.jpeg",
      "/uploads/rock-in-country-18-10-2025/f03daad4-0f69-4ba2-9a42-655473ee9ef3.jpeg",
      "/uploads/rock-in-country-18-10-2025/f84760d7-e901-41bc-b828-27f7ea38ac99.jpeg",
      "/uploads/rock-in-country-18-10-2025/fa9f6077-af89-4293-8b27-741394a922b6.jpeg",
      "/uploads/rock-in-country-18-10-2025/fb485b0d-8d14-4989-b01d-5b891cdc2275.jpeg",
      "/uploads/rock-in-country-18-10-2025/fe8865e5-299e-48cf-95ca-5667386a1725.jpeg",
    ],
    videos: [
      {
        src: "/uploads/rock-in-country-18-10-2025/VID_20251026_124254_315.mp4",
      },
    ],
    pinned: {
      videos: [
        {
          src: "/uploads/rock-in-country-18-10-2025/VID_20251026_124254_315.mp4",
        },
      ],
      photos: [
        "/uploads/rock-in-country-18-10-2025/91b6a054-b5c1-41c2-9018-7be88db410b2.jpeg",
        "/uploads/rock-in-country-18-10-2025/fb485b0d-8d14-4989-b01d-5b891cdc2275.jpeg",
      ],
    },
  },
  {
    title: "Hangar 111",
    date: "04/10/2025",
    folder: "/uploads/hangar-04-10-2025",
    photos: [
      "/uploads/hangar-04-10-2025/5924c0e4-4cb8-4d80-9307-27cdca4a8f3f.jpeg",
      "/uploads/hangar-04-10-2025/51e756ca-b101-48d7-b04c-ad7d2e55999d.jpeg",
      "/uploads/hangar-04-10-2025/4409fcf2-b59f-4559-b27a-28dd7c504364.jpeg",
      "/uploads/hangar-04-10-2025/1f6ccf48-142f-4148-a95a-ae17250c9bbe.jpeg",
      "/uploads/hangar-04-10-2025/dfc2da8e-377f-4bd8-84e0-419fbf2bec75.jpeg",
      "/uploads/hangar-04-10-2025/9f5dd475-6b21-4d98-906a-0254fc6cb094.jpeg",
      "/uploads/hangar-04-10-2025/6347e16e-298c-458b-b493-4a0ef6ab419e.jpeg",
    ],
    videos: [],
  },
  {
    title: "Porks Festival Valinhos",
    date: "02/08/2025",
    folder: "/uploads/porks-festival-02-08-2025",
    photos: [
      "/uploads/porks-festival-02-08-2025/c005f58d-add2-431d-bf14-df2e66b1a8a4.jpeg",
      "/uploads/porks-festival-02-08-2025/da2eaf24-3c35-41ac-adbf-15b706b90a25.jpeg",
      "/uploads/porks-festival-02-08-2025/d6dd96b9-74eb-4664-84da-5adabf2822ce.jpeg",
      "/uploads/porks-festival-02-08-2025/bc1a3d4b-3dbd-4a7b-90ea-33f12f2c8b01.jpeg",
      "/uploads/porks-festival-02-08-2025/ad139577-eab3-4d95-a241-360fef03e7bc.jpeg",
      "/uploads/porks-festival-02-08-2025/a62bf22a-33b3-493c-af16-c435359ae04b.jpeg",
      "/uploads/porks-festival-02-08-2025/6c874390-57d0-4e72-8e60-ffe2a19a3d19.jpeg",
      "/uploads/porks-festival-02-08-2025/4be94707-6b2d-47d5-87ed-915e7d1f64c6.jpeg",
      "/uploads/porks-festival-02-08-2025/44895764-a26d-42d1-a9b5-10a2a36f781b.jpeg",
      "/uploads/porks-festival-02-08-2025/3e8b2e64-950b-4236-b7c0-db14c613e034.jpeg",
      "/uploads/porks-festival-02-08-2025/287f7b12-4d36-4705-940f-717b0c71c5c2.jpeg",
      "/uploads/porks-festival-02-08-2025/13aa6d1d-3d99-456f-bb9d-5f51e0031ef1.jpeg",
      "/uploads/porks-festival-02-08-2025/0e7a17c6-596d-4bff-8264-693f37a7b434.jpeg",
    ],
    videos: [],
  },
  {
    title: "Clube Empyreo - Leme",
    date: "28/02/2025",
    folder: "/uploads/clube-empyreo-28-02-2025",
    photos: [
      "/uploads/clube-empyreo-28-02-2025/65f9ea7d-9215-40c1-a400-1bcd01932717.jpeg",
      "/uploads/clube-empyreo-28-02-2025/71c975ab-2deb-4f63-a28e-318819a20c6e.jpeg",
      "/uploads/clube-empyreo-28-02-2025/6d208b6c-84a7-46f3-90f1-cef1e79ed9ea.jpeg",
      "/uploads/clube-empyreo-28-02-2025/5311ba45-b760-4e2a-a934-e0b4dbee584c.jpeg",
      "/uploads/clube-empyreo-28-02-2025/439fb2f4-0ae3-4f10-8f00-151434644d02.jpeg",
      "/uploads/clube-empyreo-28-02-2025/34a8f4b7-99e4-4b84-aad0-79f4bef27acd.jpeg",
      "/uploads/clube-empyreo-28-02-2025/318803ff-a4bc-4a45-bdf1-60a1b4c0e463.jpeg",
      "/uploads/clube-empyreo-28-02-2025/2ac39ca6-fdd2-406a-9c48-5787a00bc014.jpeg",
      "/uploads/clube-empyreo-28-02-2025/26bd21b5-d49e-41e7-b210-03e1a59662d4.jpeg",
      "/uploads/clube-empyreo-28-02-2025/2106b5e1-3402-4173-98a4-38d835acb124.jpeg",
      "/uploads/clube-empyreo-28-02-2025/1f145782-6864-420c-a7e3-b5bb12e6fa5e.jpeg",
      "/uploads/clube-empyreo-28-02-2025/19d55941-c9f1-45c7-aae0-874ba8cc32b3.jpeg",
      "/uploads/clube-empyreo-28-02-2025/a58b06b8-65f6-4d8e-bb3c-83c633f4b908.jpeg",
      "/uploads/clube-empyreo-28-02-2025/9c8f1c4d-3d34-47b7-be3e-20e088306fb7.jpeg",
      "/uploads/clube-empyreo-28-02-2025/97349397-6489-4389-a720-7d1a29c5cea0.jpeg",
      "/uploads/clube-empyreo-28-02-2025/91e6dd70-07b4-48b5-92e3-8d7fe5fe5575.jpeg",
      "/uploads/clube-empyreo-28-02-2025/8ca09eb0-5324-44ed-b70e-33d7d77a825d.jpeg",
      "/uploads/clube-empyreo-28-02-2025/8048d408-8b2d-45c2-88b2-44ac17f3a120.jpeg",
      "/uploads/clube-empyreo-28-02-2025/7e092a05-abdf-4997-9f6b-1577b7c6a256.jpeg",
      "/uploads/clube-empyreo-28-02-2025/7de3a19b-4699-416d-bb40-60d0e90ba1ce.jpeg",
      "/uploads/clube-empyreo-28-02-2025/095d5894-1945-473e-aea5-0777b123db1d.jpeg",
      "/uploads/clube-empyreo-28-02-2025/f7e9751b-63a8-43f0-bc3c-3ecb536f4ccf.jpeg",
      "/uploads/clube-empyreo-28-02-2025/e55328f8-6a38-4488-93ca-eb03f38d1410.jpeg",
      "/uploads/clube-empyreo-28-02-2025/dd09144d-0e3b-4c2f-869f-16650bde8c6e.jpeg",
      "/uploads/clube-empyreo-28-02-2025/d3214a98-398f-483d-a9d7-d11304fd7b5d.jpeg",
      "/uploads/clube-empyreo-28-02-2025/a73b66de-ceee-4e96-94cf-c16e9f45a4d8.jpeg",
    ],
    videos: [],
  },
  {
    title: "Jukadani Rock Bar - Mogi Mirim",
    date: "28/06/2025",
    folder: "/uploads/jukadani-28-06-2025",
    photos: [
      "/uploads/jukadani-28-06-2025/dd13988b-0f75-4395-9f0a-dc8db44cd4fd.jpeg",
      "/uploads/jukadani-28-06-2025/2353ea00-eeed-4831-bed7-47e58161c490.jpeg",
      "/uploads/jukadani-28-06-2025/11a7c5c7-88e9-463c-a3fd-d43c532614ee.jpeg",
      "/uploads/jukadani-28-06-2025/01b29fa1-5c59-4c68-ade1-cf82a647c091.jpeg",
      "/uploads/jukadani-28-06-2025/01b29fa1-5c59-4c68-ade1-cf82a647c091 (1).jpeg",
      "/uploads/jukadani-28-06-2025/72352dd6-cf55-427d-82ab-bcbdb3cb2d5d.jpeg",
    ],
    videos: [],
  },
];

export function getAlbumCoverImagesFromPhotos(photos: string[], count = 5) {
  return photos.slice(0, count);
}

function parseDateBR(d: string): Date {
  // dd/mm/yyyy
  const [dd, mm, yyyy] = d.split("/").map((p) => parseInt(p, 10));
  return new Date(yyyy, (mm || 1) - 1, dd || 1);
}

export function getAlbumsSortedDesc(): Album[] {
  return [...albums].sort(
    (a, b) => parseDateBR(b.date).getTime() - parseDateBR(a.date).getTime()
  );
}
