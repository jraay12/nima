// CreateMemberPage.tsx
import { useNavigate } from "react-router";
import { MemberForm } from "../../component/MemberForm";
import { useCreateMember } from "../../features/members/member.hook";

const CreateMemberPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateMember();

  return (
    <div className="mx-auto pb-20">
      <div className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Member</h1>
        <p className="text-sm text-gray-500">Fill in the details below to add a new NIMANV member.</p>
      </div>
      <MemberForm
        isSubmitting={isPending}
        onCancel={() => navigate(-1)}
        onSubmit={(fd) => mutate(fd, { onSuccess: () => navigate(-1) })}
      />
    </div>
  );
};

export default CreateMemberPage;