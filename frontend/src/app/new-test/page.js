"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import References from "@/components/References";
import ModalWrapper from "@/components/ModalWrapper";
import { useState } from "react";
import FileDropZone from "@/components/FileDropZone";
import Card, {
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/Card";
import { FaRegBookmark, FaRegFileAlt, FaTimes, FaUpload } from "react-icons/fa";
import { useRuns } from "@/hook/useRuns";
import { useForm, Controller } from "react-hook-form";

export default function NewTest() {
  const [showRef, setShowRef] = useState(false);
  const [selectedReference, setSelectedReference] = useState(null);
  const [attachedReference, setAttachedReference] = useState(null);

  const router = useRouter();
  const { handleStartRun } = useRuns();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleAttach = () => {
    if (selectedReference) {
      setAttachedReference(selectedReference);
      setShowRef(false);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("tunnel-url", data.tunnelUrl);
    formData.append("github-url", data.githubUrl);
    formData.append("project-description", data.projectDescription);
    formData.append("environment", data.environment);
    if (data.contactAsset?.[0]) {
      formData.append("assets", data.contactAsset[0]);
    }

    if (Array.isArray(data.whitePaper)) {
      data.whitePaper.forEach((file, idx) => {
        formData.append(`whitePaper[${idx}]`, file);
      });
    } else if (data.whitePaper?.[0]) {
      formData.append("whitePaper", data.whitePaper[0]);
    }

    const res = await handleStartRun(formData);
    const repoUrl = res?.job_data?.github_url || "";
    if (repoUrl.length > 0) {
      router.push(`/mas-run?repoUrl=${encodeURIComponent(repoUrl)}`);
    } else {
      alert("Error starting the run. Please try again.");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container mx-auto flex flex-col gap-8 py-8 px-4"
      >
        <Card
          title="Upload Repository"
          description="Please upload your repository as a .zip file for analysis."
        >
          <div className="flex items-center gap-2">
            <FaUpload />
            <CardTitle className="mb-0">Upload Repository</CardTitle>
          </div>
          <CardDescription>
            Please upload your repository as a .zip file for analysis.
          </CardDescription>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="mb-2">Contract Asset</p>
              <Controller
                control={control}
                name="contactAsset"
                rules={{ required: true }}
                render={({ field }) => (
                  <FileDropZone
                    acceptedFileTypes=".zip"
                    maxFileSize={50 * 1024 * 1024} // 50MB
                    maxFiles={1}
                    {...field}
                  />
                )}
              />
              {errors.contactAsset && (
                <span className="text-red-500 text-xs">
                  Please upload a contract asset zip file.
                </span>
              )}
            </div>
            <div>
              <p className="mb-2">Tunnel URL</p>
              <input
                type="text"
                placeholder="Tunnel URL"
                className="w-full py-2 px-3 border border-gray-border rounded-md bg-surface text-foreground placeholder-helper placeholder:italic focus-visible:outline-none"
                {...register("tunnelUrl", { required: true })}
                aria-invalid={errors.tunnelUrl ? "true" : "false"}
              />
              {errors.tunnelUrl && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>
            <div>
              <p className="mb-2">Github URL</p>
              <input
                type="text"
                placeholder="Github URL"
                className="w-full py-2 px-3 border border-gray-border rounded-md bg-surface text-foreground placeholder-helper placeholder:italic focus-visible:outline-none"
                {...register("githubUrl", { required: true })}
                aria-invalid={errors.githubUrl ? "true" : "false"}
              />
              {errors.githubUrl && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <FaRegFileAlt />
            <CardTitle className="mb-0">Project description</CardTitle>
          </div>
          <CardDescription>
            Please provide the protocol documentation to help better inform the
            repository.
          </CardDescription>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="mb-2">Description</p>
              <textarea
                className="w-full py-2 px-3 h-36 border border-gray-border rounded-md bg-surface text-foreground placeholder-helper placeholder:italic focus-visible:outline-none"
                placeholder="Insert documentation..."
                {...register("projectDescription", { required: true })}
                aria-invalid={errors.projectDescription ? "true" : "false"}
              />
              {errors.projectDescription && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
            </div>
            <div>
              <p className="mb-2">White Paper (Optical)</p>
              <Controller
                control={control}
                name="whitePaper"
                render={({ field }) => (
                  <FileDropZone
                    size="small"
                    acceptedFileTypes=".pdf,.doc,.docx"
                    maxFileSize={50 * 1024 * 1024} // 50MB
                    multiple
                    {...field}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <FaRegBookmark />
            <CardTitle className="mb-0">Attach Reference</CardTitle>
          </div>
          <CardDescription>
            Attach related contracts you&apos;ve ref to inform vulnerability
            exploration.
          </CardDescription>
          <CardContent>
            <div className="flex flex-col gap-4">
              {attachedReference ? (
                <div className="flex items-center justify-between p-3 bg-surface border border-gray-border rounded-lg hover:bg-surface-hover transition-colors">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/defi.png"
                      width={35}
                      height={35}
                      alt="DeFiHackLabs"
                    />
                    <Image
                      src="/images/file.png"
                      width={20}
                      height={20}
                      alt="File"
                    />
                    <p className="text-sm">{selectedReference}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAttachedReference(null)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    title="Remove file"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full flex flex-row items-center justify-center px-4 py-1 gap-2 rounded-lg bg-gray-border"
                  onClick={() => setShowRef(true)}
                >
                  <p className="text-lg text-helper">+</p>
                  <p className="text-sm font-semibold text-helper">
                    Attach Files
                  </p>
                </button>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <FaRegFileAlt />
            <CardTitle className="mb-0">Select an Environment</CardTitle>
          </div>
          <CardDescription>
            Please select the environment where you&apos;d like to deploy the
            smart contracts from the repository indicated.
          </CardDescription>
          <CardContent>
            <select
              className="w-full py-2 px-4 border border-gray-border rounded-md bg-surface text-foreground"
              {...register("environment", { required: true })}
              aria-invalid={errors.environment ? "true" : "false"}
            >
              <option value="" disabled>
                Choose environment…
              </option>
              <option value="local">Local</option>
              <option value="testnet">Testnet</option>
            </select>
          </CardContent>
        </Card>
        <div className="flex flex-row justify-end items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="border-2 bg-surface border-gray-border text-gray-300 hover:bg-surface-hover px-6 py-3 rounded-lg transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover border-2 border-primary hover:border-primary-hover px-6 py-3 rounded-lg transition-all"
          >
            Next
          </button>
        </div>
      </form>
      {showRef && (
        <ModalWrapper>
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative flex flex-col px-8 py-4 bg-surface border border-gray-border gap-4 rounded-lg w-full max-w-lg">
              <button
                type="button"
                onClick={() => setShowRef(false)}
                className="absolute top-4 right-4"
              >
                <Image src="/images/x.png" alt="Close" width={16} height={16} />
              </button>

              <div className="flex flex-col gap-1">
                <p className="text-md font-semibold">References</p>
                <p className="text-secondary">
                  Identify smart contracts with similar vulnerabilities to
                  support your hypothesis.
                </p>
              </div>

              <References
                clicked={selectedReference}
                setClicked={setSelectedReference}
              />

              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-sm transition-all"
                onClick={handleAttach}
              >
                Attach
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </>
  );
}
